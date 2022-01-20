import { Container } from '@mui/material';
import React from 'react'
import BuyingRequestCard from "../../src/components/request/BuyingRequestCard";
import BuyingRequestContextProvider from '../../src/context/BuyingRequestContext';
import BuyingRequestModal from '../../src/components/request/BuyingRequestModal';

const Buying = () => {
    return (
        <BuyingRequestContextProvider>
            <BuyingRequestModal/>
            <Container>
                <BuyingRequestCard
                    thumbnail= "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fcabbage&psig=AOvVaw0iwWlpL_3TFAONxU_czjzP&ust=1642581738498000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCIDDkM3zuvUCFQAAAAAdAAAAABAD"
                    quantity= {120}
                    progress= {100}
                    title= "Cabbage"
                    price= "12000VND"
                    postBy = {{
                        id: "123456",
                        avatar: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fbaoangiang.com.vn%2Fphim-avatar-phan-2-hoan-quay-o-new-zealand-vi-dich-covid-19-a266928.html&psig=AOvVaw3DQ1Z2uPAg298nTVTq5aRv&ust=1642581903037000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOD086D0uvUCFQAAAAAdAAAAABAD",
                        username:"Avatar"
                    }}
                    user= {[
                        {
                            username: "Avatar 1",
                            avatar: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fgiaitri.vn%2Fsieu-pham-avatar-2-se-duoc-doi-sang-nam-2021&psig=AOvVaw3DQ1Z2uPAg298nTVTq5aRv&ust=1642581903037000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOD086D0uvUCFQAAAAAdAAAAABAJ",
                            id: "123455",
                            quantity: 40
                        }
                    ]}
                />
                <BuyingRequestCard
                    thumbnail= "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fcabbage&psig=AOvVaw0iwWlpL_3TFAONxU_czjzP&ust=1642581738498000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCIDDkM3zuvUCFQAAAAAdAAAAABAD"
                    quantity= {120}
                    progress= {30}
                    title= "Cabbage"
                    price= "12000VND"
                    postBy = {{
                        id: "123456",
                        avatar: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fbaoangiang.com.vn%2Fphim-avatar-phan-2-hoan-quay-o-new-zealand-vi-dich-covid-19-a266928.html&psig=AOvVaw3DQ1Z2uPAg298nTVTq5aRv&ust=1642581903037000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOD086D0uvUCFQAAAAAdAAAAABAD",
                        username:"Avatar"
                    }}
                    user= {[
                        {
                            username: "Avatar 1",
                            avatar: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fgiaitri.vn%2Fsieu-pham-avatar-2-se-duoc-doi-sang-nam-2021&psig=AOvVaw3DQ1Z2uPAg298nTVTq5aRv&ust=1642581903037000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOD086D0uvUCFQAAAAAdAAAAABAJ",
                            id: "123455",
                            quantity: 40
                        }
                    ]}
                />
                <BuyingRequestCard
                    thumbnail= "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fcabbage&psig=AOvVaw0iwWlpL_3TFAONxU_czjzP&ust=1642581738498000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCIDDkM3zuvUCFQAAAAAdAAAAABAD"
                    quantity= {120}
                    progress= {10}
                    title= "Cabbage"
                    price= "12000VND"
                    postBy = {{
                        id: "123456",
                        avatar: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fbaoangiang.com.vn%2Fphim-avatar-phan-2-hoan-quay-o-new-zealand-vi-dich-covid-19-a266928.html&psig=AOvVaw3DQ1Z2uPAg298nTVTq5aRv&ust=1642581903037000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOD086D0uvUCFQAAAAAdAAAAABAD",
                        username:"Avatar"
                    }}
                    user= {[
                        {
                            username: "Avatar 1",
                            avatar: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fgiaitri.vn%2Fsieu-pham-avatar-2-se-duoc-doi-sang-nam-2021&psig=AOvVaw3DQ1Z2uPAg298nTVTq5aRv&ust=1642581903037000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCOD086D0uvUCFQAAAAAdAAAAABAJ",
                            id: "123455",
                            quantity: 40
                        }
                    ]}
                />
            </Container>
        </BuyingRequestContextProvider>
    )
}

export default Buying
