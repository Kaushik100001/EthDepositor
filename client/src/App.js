
import   React , { useState,useEffect }   from "react";
const ethers = require("ethers")

function App() {
  const [depositValue , setDepositValue] = useState('')
  const [balance , setBalance] = useState(0)
  const [greet , setGreet] = useState('')
  const [greetingValue , setGreetingValue]=useState('')
  
  let contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"




  const ABI = [
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "greet",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_greeting",
          "type": "string"
        }
      ],
      "name": "setGreeting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const contract = new ethers.Contract(contractAddress, ABI, signer);

  
// MetaMask requires requesting permission to connect users accounts
useEffect(()=>{

  const connectWallet = async ()=>{
    await provider.send("eth_requestAccounts", []);
  }
  
  const getBalance= async ()=>{
    let balance = await provider.getBalance(contractAddress)
    let formattedBalance=ethers.utils.formatEther(balance)
   setBalance(formattedBalance)
  }

  const  getGreeting = async () => {
    const greeting = await contract.greet()
    setGreet(greeting)
  }


  connectWallet().catch(console.error)
  getBalance().catch(console.error)
  getGreeting().catch(console.error)
})


   
  const handleDepositChange=(e)=>{
    setDepositValue(e.target.value)
    }

  const handleGreetChange=(e)=>{
    setGreetingValue( e.target.value )
  }

  const handleDepositSubmit=async(e)=>{
    e.preventDefault() ;
    console.log(depositValue)
    const ethValue = ethers.utils.parseEther(depositValue) ; 
    const depositEth = await contract.deposit({value:ethValue})
    await depositEth.wait()
    let balance = await provider.getBalance(contractAddress)
    let formattedBalance=ethers.utils.formatEther(balance)
    setBalance(formattedBalance)
    setDepositValue(0)


  }

  const handleGreetSubmit= async(e)=>{
    e.preventDefault() ; 
    const greetUpdate = await contract.setGreeting(greetingValue)
    await greetUpdate.wait() 
    setGreet(greetingValue)
    setGreetingValue("")

  }

  return (
    <div classname="container">
      <div class="container text-center">
        <div class="row align-items-start mt-5">
          <div class="col">
            <h3>{greet}</h3>
            <p>Contract balance: {balance}</p>
          </div>
          <div class="col">
            <form onSubmit={handleDepositSubmit}>
              <div class="mb-3">
                 <input type="number" class="form-control" placeholder="0" onChange={handleDepositChange} />
              </div>
              <button type="submit" class="btn btn-primary">Deposit</button>
            </form>
            <form className="mt-5" onSubmit={handleGreetSubmit}>
              <div class="mb-3">
                 <input type="text" class="form-control" placeholder="Greeting" value={greetingValue} onChange={handleGreetChange} />
              </div>
              <button type="submit" class="btn btn-dark">Change</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
