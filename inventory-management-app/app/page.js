//new tutuorial video page

"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { firestore } from "@/firebase"
import { query, collection, doc, getDocs, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { Button, Stack, Typography, Modal, TextField, Box } from '@mui/material';


export default function None() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState("")
    const [itemQuantity, setItemQuantity] = useState(1)
    const [isEditing, setIsEditing] = useState(false);
    const [originalItemName, setOriginalItemName] = useState("");

    const updateInventory = async () => {
        const snapshot = query(collection(firestore, "inventory"))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        docs.forEach((doc) => {
            inventoryList.push({
                name: doc.id,
                ...doc.data(),
            })
        })
        setInventory(inventoryList)
    }

    const removeItem = async (item, reduction) => {
        filterNumber(reduction)
        item = item.charAt(0).toUpperCase() + item.slice(1)
        const docRef = doc(collection(firestore, "inventory"), item)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            if (quantity === 1) {
                await deleteDoc(docRef)
            } else {
                await setDoc(docRef, { quantity: quantity - reduction })
            }
        }
        await updateInventory()
    }

    function filterNumber(varName){
        varName = parseInt(varName, 10)
        if (isNaN(varName)) {varName = 0;}
    }

    const addItem = async (name, quantity) => {
        name = name.charAt(0).toUpperCase() + name.slice(1)
        const docRef = doc(collection(firestore, "inventory"), name)
        const docSnap = await getDoc(docRef)
        filterNumber(quantity)
       /*  quantity = parseInt(quantity, 10)
        if (isNaN(quantity)) {quantity = 0;} */

        if (docSnap.exists()) {
            const oldQuantity = docSnap.data().quantity
            filterNumber(oldQuantity)
            await setDoc(docRef, { quantity: oldQuantity + quantity })
        } else {
            await setDoc(docRef, { quantity: quantity })
        }
        await updateInventory()
    }

    const editItem = async (originalName, newName, newQuantity) => {
        originalName = originalName.charAt(0).toUpperCase() + originalName.slice(1);
        newName = newName.charAt(0).toUpperCase() + newName.slice(1)
        const oldDocRef = doc(collection(firestore, "inventory"), originalName)
        const oldDocSnap = await getDoc(oldDocRef)
        newQuantity = parseInt(newQuantity, 10);
        console.log("heheh")
        if (oldDocSnap.exists()) { //checks if exists
            await deleteDoc(oldDocRef);
            const newDocRef = doc(collection(firestore, "inventory"), newName);
            await setDoc(newDocRef, { quantity: newQuantity })
        } else {
            const newDocRef = doc(collection(firestore, "inventory"), newName);
            await setDoc(newDocRef, { quantity: newQuantity })
        }
        await updateInventory()
    }

    useEffect(() => {
        updateInventory()
    }, [])

    const handleOpen = () => setOpen(true)
    const handleClosed = () => {
        setOpen(false)
        setIsEditing(false)
        setItemName("");
        setItemQuantity(1);
        setOriginalItemName("");
    }

    return (
        <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" gap={2} flexDirection="column">

            <Modal open={open} onClose={handleClosed}>
                <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    sx={{ transform: "translate(-50%, -50%)", }}
                    width={500}
                    bgcolor="white"
                    border="2px solid #000"
                    boxShadow={24}
                    p={4}
                    display={"flex"}
                    flexDirection="column"
                    gap={3}
                >
                    <Typography variant="h6">Add item's</Typography>
                    <Stack width="100%" direction="row" spacing={2}>
                        <TextField
                            variant="outlined"
                            fullWidth
                            label="Name"
                            id="outlined-basic"
                            value={itemName} 
                            onChange={(e) => {
                                setItemName(e.target.value)
                            }}
                        />
                        {/* add a quantity editor */}

                        <TextField id="outlined-number" label="Quantity" variant="outlined"
                        type="number" InputLabelProps={{shrink: true,}} 
                        InputProps={{ inputProps: { min: "1", step:"1"}}}
                        /* defaultValue={1} */ sx={{ width: '30%' }}
                        value={itemQuantity}
                        onChange={(e) => {
                            setItemQuantity(parseInt(e.target.value, 10) || 0)
                        }}
                        
                        />

                        <Button
                            variant="outlined"
                            onClick={() => {
                                if (isEditing){
                                    editItem(originalItemName, itemName, itemQuantity)
                                } else{
                                    addItem(itemName, itemQuantity)
                                }
                                handleClosed()  //check that originalitemnameis being set
                            }}
                        >{isEditing ? "Save" : "Add"}</Button>
                    </Stack>

                </Box>

            </Modal>
            <Button variant="contained" onClick={() => {
                handleOpen()
            }}>
                Add Item's
            </Button>

            <Box border="1px solid #333">
                <Box
                    width="800px"
                    height="100px"
                    bgcolor="#ADD8E6"
                    alignItems="center"
                    justifyContent="center"
                    display="flex"
                >
                    <Typography variant="h2"
                        color="#333">Inventory Items
                    </Typography>
                </Box>

                <Stack width="800px" height="300px" spacing={2} overflow="auto">
                    {
                        inventory.map(({ name, quantity }) => (
                            <Box key={name} width="100%"
                                minHeight="150px"  display="flex"
                                alignItems="center" justifyContent="space-between"
                                backgroundColor="#f0f0f0" padding={5}>
                                <Typography variant="h3" color="#333" maxWidth="50%"
                                    textAlign="center" sx={{
                                        overflow: "hidden", textOverflow: "ellipsis",
                                        wordBreak:"break-word", whiteSpace:"nowrap"
                                    }}>
                                    {name.charAt(0).toUpperCase() + name.slice(1)}
                                </Typography>
                                <Typography variant="h3" color="#333"
                                    textAlign="center">{quantity}</Typography>

                                <Button variant="contained" onClick={() => {
                                    removeItem(name, 1)
                                }}>Remove</Button>

                                <Button variant="contained" onClick={() => {
                                    setItemName(name)
                                    setItemQuantity(quantity)
                                    setOriginalItemName(name)
                                    setIsEditing(true)
                                    handleOpen()
                                }}>Edit</Button>

                            </Box>
                        ))}
                </Stack>
            </Box>
        </Box>
    )
}


/* features to add
    search option
    instead of the remove button, make it an option to append quantity - if quant = 0, then remove entry from db? have a save button so changes are only made to the db when save pressed
    when adding items, have a lil up and down arrow to set the quantity of what to add(append additem func to compensate for this by taking amount as a parameter)
    make frontend nicer and proffesional - search tiktok for nice frontends and use for inspo?
    deploy to vercel
    then include ai to scan items
    do bonus tasks



    curenrlty implelemnent a new handle for openeing a similar menu to old one
    make it so you can update a record. set quantity for original. 
    maybe make it same handle as the op but if a new name is in it, then it adds to db as new record. 
*/