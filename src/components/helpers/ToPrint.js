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


export default class Test extends Component{

    render(){
    const fontSize = "0.7rem";
    const columns = Object.keys(this.props.format);
    const rows = Object.values(this.props.format);
    return(<TableContainer component={Paper}>
    <Table  aria-label="simple table">
    <TableHead>
        <TableRow>
        <TableCell align="right" style={{fontSize:fontSize,fontWeight:"bold"}}>S.No</TableCell>
            {
                columns.map(data=><TableCell align="right" style={{fontSize:fontSize,fontWeight:"bold"}}>{data}</TableCell>)
            }
        </TableRow>
    </TableHead>
    <TableBody>
    {
        this.props.data.map((data,index)=>(
        <TableRow>
        <TableCell align="right" style={{fontSize:fontSize}}>{index+1} </TableCell>
        {
            rows.map(row=><TableCell align="right" style={{fontSize:fontSize}}>{data[row]}</TableCell>)
        }
        </TableRow>
        ))
    }
    </TableBody>
    </Table>
</TableContainer>
)}
}

