import { Avatar, Box, Button, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import CreateUserModal from "../../src/components/auth/CreateUserModal";
import ConfirmationModal from "../../src/components/layouts/ConfirmationModal";
import { AuthContext, UserInformationValue } from "../../src/context/AuthContext";
import { LayoutContext } from "../../src/context/LayoutContext";

const PackingEmployee = () => {
    const formatDateString = "dd/MM/yyyy HH:mm";
    const { users, loadUsers, changeIsToggleOnCreateUserModal, changeCurrentUserId } = useContext(AuthContext);
    const { changeConfirmationModalValues } = useContext(LayoutContext);
    const [inactiveUser, setInactiveUser] = useState<any[]>([]);
    const [activeUser, setActiveUser] = useState<any[]>([]);

    const inactiveUserColumn: GridColDef[] = [
        { field: "id", headerName: "id", width: 100 },
        { field: "username", headerName: "Tên người dùng", width: 200 },
        { field: "createdDate", headerName: "Ngày tạo", width: 200 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "phone", headerName: "Số điện thoại", width: 200 },
        { field: "loginMethod", headerName: "Phương thức đăng nhập", width: 100 },
        {
            field: "active",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button variant="contained" color="warning">
                        Tái kích hoạt
                    </Button>
                );
            },
        },
        {
            field: "view",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button variant="contained" color="primary">
                        Xem thông tin
                    </Button>
                );
            },
        },
    ];

    const activeUserColumn: GridColDef[] = [
        { field: "id", headerName: "id", width: 100 },
        { field: "username", headerName: "Tên người dùng", width: 200 },
        { field: "createdDate", headerName: "Ngày tạo", width: 200 },
        { field: "email", headerName: "Email", width: 200 },
        { field: "phone", headerName: "Số điện thoại", width: 200 },
        { field: "loginMethod", headerName: "Phương thức đăng nhập", width: 100 },
        {
            field: "inactive",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button variant="contained" color="error">
                        Vô hiệu hoá
                    </Button>
                );
            },
        },
        {
            field: "view",
            headerName: "",
            width: 150,
            renderCell: () => {
                return (
                    <Button variant="contained" color="primary">
                        Xem thông tin
                    </Button>
                );
            },
        },
    ];

    useEffect(() => {
        loadUsers("1234567893");
        return () => {
            setInactiveUser([]);
            setActiveUser([]);
        };
    }, []);

    useEffect(() => {
        if (users) {
            const mappedInactiveUsers: any[] = users
                .filter(user => user.isActive === false)
                .map((user: UserInformationValue) => {
                    const { avatar, createdDate, id, email, phone, loginMethod, username } = user;
                    return {
                        avatar:
                            avatar === "'avatar'" || avatar === "" || !avatar ? (
                                <Avatar src={avatar} />
                            ) : (
                                <Avatar sx={{ bgcolor: red[500] }}>{username[0]}</Avatar>
                            ),
                        id,
                        username,
                        createdDate: format(new Date(createdDate), formatDateString),
                        email,
                        phone,
                        loginMethod,
                    };
                });
            const mappedActiveUsers: any[] = users
                .filter(user => user.isActive === true)
                .map((user: UserInformationValue) => {
                    const { avatar, createdDate, id, email, phone, loginMethod, username } = user;
                    return {
                        avatar:
                            avatar === "'avatar'" || avatar === "" || !avatar ? (
                                <Avatar src={avatar} />
                            ) : (
                                <Avatar sx={{ bgcolor: red[500] }}>{username[0]}</Avatar>
                            ),
                        id,
                        username,
                        createdDate: format(new Date(createdDate), formatDateString),
                        email,
                        phone,
                        loginMethod,
                    };
                });
            setInactiveUser(mappedInactiveUsers);
            setActiveUser(mappedActiveUsers);
        }
    }, [users]);

    return (
        <Box p={6}>
            <CreateUserModal role="packing_staff" />
            <ConfirmationModal />
            <Typography textAlign="center" marginTop={3} marginBottom={3} variant="h4">
                Tài khoản đang được sử dụng
            </Typography>
            <Box display="flex" justifyContent="flex-end" mt={2} mb={4}>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => {
                        changeIsToggleOnCreateUserModal();
                    }}
                >
                    Tạo người dùng mới
                </Button>
            </Box>
            <DataGrid
                getRowId={row => row.id}
                rows={activeUser}
                columns={activeUserColumn}
                disableSelectionOnClick
                autoHeight
                onCellClick={row => {
                    if (row.field === "inactive") {
                        changeCurrentUserId(row.id.toString(), "1234567893");
                        changeConfirmationModalValues({
                            isToggle: true,
                            title: "Bạn chắc chắn muốn vô hiệu hoá tài khoản người dùng này?",
                            type: "inactiveUser",
                        });
                    }
                }}
                localeText={{
                    toolbarDensity: "Size",
                    toolbarDensityLabel: "Size",
                    toolbarDensityCompact: "Small",
                    toolbarDensityStandard: "Medium",
                    toolbarDensityComfortable: "Large",
                }}
                components={{
                    Toolbar: GridToolbar,
                }}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                pagination
            />
            <Typography textAlign="center" marginTop={3} marginBottom={3} variant="h4">
                Tài khoản đang bị vô hiệu hoá
            </Typography>
            <DataGrid
                getRowId={row => row.id}
                rows={inactiveUser}
                columns={inactiveUserColumn}
                disableSelectionOnClick
                autoHeight
                onCellClick={row => {
                    if (row.field === "active") {
                        changeCurrentUserId(row.id.toString(), "1234567893");
                        changeConfirmationModalValues({
                            isToggle: true,
                            title: "Bạn chắc chắn muốn tái kích hoạt tài khoản người dùng này?",
                            type: "activeUser",
                        });
                    }
                }}
                localeText={{
                    toolbarDensity: "Size",
                    toolbarDensityLabel: "Size",
                    toolbarDensityCompact: "Small",
                    toolbarDensityStandard: "Medium",
                    toolbarDensityComfortable: "Large",
                }}
                components={{
                    Toolbar: GridToolbar,
                }}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20]}
                pagination
            />
        </Box>
    );
};

export default PackingEmployee;
