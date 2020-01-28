import React,{Component} from "react";
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper
} from "@material-ui/core"


export default class extends Component{

    render(){
    const fontSize = "0.9rem";
    const items = Object.keys(this.props.data);
    const quantity = Object.values(this.props.data);
    return(
    <TableContainer component={Paper}>
    <Table  aria-label="simple table">
    <TableHead>
        <TableRow>
            <TableCell align="center" style={{fontSize:fontSize,fontWeight:"bold"}}>Items</TableCell>
            <TableCell align="center" style={{fontSize:fontSize,fontWeight:"bold"}}>Quantity</TableCell>
        </TableRow>
    </TableHead>
    <TableBody>
    {
        items.map((data,index)=>(
        <TableRow>
            <TableCell align="center" style={{fontSize:fontSize}}>{data}</TableCell>
            <TableCell align="center" style={{fontSize:fontSize}}>{quantity[index]}</TableCell>
        </TableRow>
        ))
    }
    </TableBody>
    </Table>
    </TableContainer>
    )
}

}

