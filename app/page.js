'use client'
import Image from "next/image";
import {useState,useEffect} from "react";
import {firestore} from "@/firebase";
import {collection, doc, getDocs, setDoc, deleteDoc, query, getDoc} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {Box, Modal,Stack,TextField,Typography, Button} from '@mui/material'

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [user, setUser] = useState(null);


  
  const handleGoogle = async (e) => {  
    const provider =  new GoogleAuthProvider();
    const auth = getAuth();

    try {
        const result = await signInWithPopup(auth, provider)
        const user = result.user;
        console.log("User signed in: ", user);
        setUser(user);
      
    } catch(error) {
        console.log("Error during sign-in: ", error);
    }
  };

  const updateInventory = async () =>{
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = []
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    }

    const addItem = async(item) =>{
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()){
        const {quantity} = docSnap.data()
        await setDoc(docRef, {quantity: quantity + 1})
       } else {
          await setDoc(docRef, {quantity: 1})
        }
      await updateInventory();
    }

    const removeItem = async (item) =>{
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)

      if(docSnap.exists()){
        const {quantity} = docSnap.data()
        if(quantity === 1){
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, {quantity: quantity -1})
        }
      }
      await updateInventory()
    }
    

  //naturally updates inventory whenever anything changes
  useEffect(() =>{
    updateInventory();
  }, []);
//make async so the enite website don;t freez while ffetching 


  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      flexDirection={"column"}
      gap={2}
      bgcolor="white"
      > 
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top = "50%"
            left = "50%"
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxshadow ={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: "translate(-50%,-50%)"
          }}>
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100" direction="row" spacing={2}>
              <TextField
              variant ="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
              />
              <Button
                variant="outlined"
                onClick={()=> {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Button variant="contained" onClick={() => {
          handleOpen()
        }}> Add New Item</Button>
        <Box border="1px solid #333">
          <Box 
            width="800px"
            height="100px"
            bgcolor="#ADD8E6"
            display="flex"
            alignItems="center"
            justifyContent="center">
              <Typography variant="h2" color="#333">
              Inventory Items
              </Typography>
            </Box>
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {
            inventory.map(({name, quantity}) => (
              <Box
                key={name}
                width="100%"
                minHeight="150px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bgcolor="#f0f0f0"
                padding={5}
              >
                <Typography variant="h3" color="#333" textAlign="center"
                >{name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h3" color="#333" textAlign="center"
                >{quantity}
                </Typography>
                <Stack direction="row" spacing={5}>
                <Button variant="contained" onClick={() =>{
                  addItem(name)
                }}>Add
                </Button>              
                <Button variant="contained" onClick={() =>{
                  removeItem(name)
                }}>Remove
                </Button>
               </Stack>
              </Box>
            ))}
        </Stack>
      </Box>
        <Button variant="outlined" onClick={handleGoogle}>
          sign in
        </Button>
    </Box>
  ) 
}
