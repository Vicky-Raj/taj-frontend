import React, { useRef, Component } from 'react'
import ReactToPrint from 'react-to-print'

const Print = props => {
	const componentRef = useRef()
	return (
		<div>
			<ReactToPrint
				trigger={() => props.trigger}
				content={() => componentRef.current}
			/>
			{/* <ComponentToPrint ref={componentRef} props={props}/> */}
		</div>
	)
}

export default Print;
