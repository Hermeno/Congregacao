import styled from "styled-components";

export const Container = styled.SafeAreaView`
 flex: 1;
 flex-direction: column;
 justify-content: flex-start;
 align-self: stretch;
 background-color: #fda4ab;
 padding: 8px;
`;

export const TitleList = styled.View`
    color: #fafafa;
    font-size:22px;
    text-align:center;
    padding:100px 15px 5px 15px
`;

export const TitleTextList = styled.Text`
    color: #080000EB;
    font-size:22px;
    text-align:center;
    padding:100px 15px 5px 15px   
`;


export const Btntexto = styled.Text`
    color: #fff;
    font-size:16px;
    padding: 5px;
`;
export const TitleBtnList = styled.View`
    justify-content: flex-end;
    align-self:flex-end;
`;
export const BtnAddTitleList = styled.View`
    margin-top:5px;
    background-color:#7C13D1FF;
    padding: 5px 10px;
    border-radius:9px;
    
`;
export const TxtAddTitleList = styled.Text`
    color: #fff;
`;













export const List = styled.View`
    width:100%;
`;
export const RowData = styled.View`
    background-color: #fafafa;
    padding: 10px;
    margin:5px 0;
    border-radius:6px;
    flex-direction:row;
    justify-content: flex-start;
`;
export const InfoData = styled.Text`
    color: #111;
    flex:1;
    flex-direction:column;
`;
export const ValueData = styled.Text`
    font-size:16px;
    flex:0;
`;
export const BtnView = styled.Text`
    justify-content:flex-end;
`;


export const Button = styled.Text`
    justify-content: flex-end;
    color:white;
    background-color: #007bff;
    height:30px;
    border-radius:8px;
    padding:5px 10px;
    width: 150px;
`;