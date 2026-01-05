import { useEffect } from 'react'

const TransactionDetail = () => {

    useEffect(() => {
        console.log("TransactionDetail: componentDidMount");
    
        return () => {
          console.log("TransactionDetail: componentWillUnmount");
        }
      }, [])

    return (
        <div>TransactionDetail</div>
    )
}

export default TransactionDetail