import styled from "styled-components";


export const Div = styled.View `
width: 100%;
background-color: #fff;
border-top:1p solid #ccc;

    alignItems: center;
    height: 100%;
    color:#363636;
`;
export const Filho = styled.View`
    width: 100%;
    height: 50px;
    display: inlin;
    color:#363636;
    justify-content: space-around;

    border:1px solid #ccc;
`;
export const InfoText = styled.Text`
 justify-content: flex-start;
 align-self:flex-start;
 margin: 5px 0 0 20px;
 font-size:18px;
`;


export const ButaoOption = styled.TouchableOpacity`
 justify-content: flex-end;
 align-self:flex-end;
 background-color:#24aaaa;
 padding:5px 10px;
 border-radius:6px;
 margin-top:-35px;
 margin-right:5px
`;

export const TitleTextListar = styled.Text`
    color: #080000EB;
    font-size:22px;
    text-align:center;
    padding:100px 15px 5px 15px;
    
    
     justify-content: flex-start;
     align-self:flex-start;
`;


export const ButaoOption2 = styled.TouchableOpacity`
 justify-content: flex-end;
 align-self:flex-end;
border:2px solid #ccc;
 padding:5px 10px;
 border-radius:6px;
 margin-top:-30px;
 margin-right:5px;
 margin-bottom:5px;
`;