import React,{Component} from "react";
import {Paper} from "@material-ui/core";


export default class extends Component{
    render(){
        return(
    <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",width:"100%"}}>
				{
				this.props.data.map(order=>{
					return(
						<Paper style={{width:"25%",textAlign:"center",padding:"2rem"}}>
							<div style={{fontSize:"1.3rem"}}>{order.name}</div>
							<div style={{display:"flex",flexDirection:"column",padding:"1rem",alignItems:"flex-start"}}>
								{
									Object.keys(order).map((item,index)=>{
										if(index === 0){
											return(
											<div style={{width:"100%",display:"flex",justifyContent:"space-between",marginBottom:"1rem"}}>
												<div >S.No</div>
												<div >Item</div>
												<div>Quantity</div>
											</div>
											);
										};
										return(
											<div style={{width:"100%",display:"flex",justifyContent:"space-between",marginBottom:"1rem"}}>
												<div >{index + "."}</div>
												<div >{item}</div>
												<div>{order[item]}</div>
											</div>
										);
									})
								}
							</div>
						</Paper>
					);
				})
				}
			</div>
        );
    }
}