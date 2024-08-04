//new tutuorial video page

"use client"
import Image from "next/image"
import { useState, useEffect } from "react"
import { firestore } from "@/firebase"
import { query, collection, doc, getDocs, getDoc, deleteDoc, setDoc, writeBatch } from "firebase/firestore";
import { Button, Stack, Typography, Modal, TextField, Box } from "@mui/material";
import { styled } from "@mui/material/styles";



export default function None() {
    const [inventory, setInventory] = useState([])
    const [open, setOpen] = useState(false)
    const [itemName, setItemName] = useState("")
    const [itemQuantity, setItemQuantity] = useState(1)
    const [isEditing, setIsEditing] = useState(false);
    const [originalItemName, setOriginalItemName] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [productCount, setProductCount] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

    const GradientBox = styled(Box)(({ theme }) => ({
        background: "linear-gradient(to right, #A6C3C9, #A6C3C9)",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: theme.spacing(2),
        flexDirection: "column",
    }));


    const defaultItems = [
        { name: "Apples", quantity: 34 },
        { name: "Bananas", quantity: 22 },
        { name: "Oranges", quantity: 17 },
        { name: "Strawberries", quantity: 9 },
        { name: "Grapes", quantity: 28 },
        { name: "Blueberries", quantity: 43 },
        { name: "Watermelons", quantity: 15 },
        { name: "Pineapples", quantity: 38 },
        { name: "Mangoes", quantity: 11 },
        { name: "Peaches", quantity: 29 },
        { name: "Plums", quantity: 20 },
        { name: "Pears", quantity: 45 },
        { name: "Cherries", quantity: 5 },
        { name: "Kiwis", quantity: 36 },
        { name: "Papayas", quantity: 8 },
        { name: "Lemons", quantity: 27 },
        { name: "Limes", quantity: 18 },
        { name: "Raspberries", quantity: 41 },
        { name: "Blackberries", quantity: 13 },
        { name: "Cantaloupes", quantity: 32 },
    ];

    const removeAllItems = async () => {
        const batch = writeBatch(firestore); // create a batch instance
        const snapshot = await getDocs(query(collection(firestore, "inventory")));

        snapshot.forEach((doc) => {
            batch.delete(doc.ref); // add each delete operation to the batch
        });

        await batch.commit(); // commit the batch
        await updateInventory();
    };


    const addInitialItems = async () => {

        for (let item of defaultItems) {
            const docRef = doc(collection(firestore, "inventory"), item.name);
            await setDoc(docRef, { quantity: item.quantity });
        }
        await updateInventory();
    };

    const resetDB = async () => {
        removeAllItems()
        addInitialItems()

    }



    const updateInventory = async () => {
        const snapshot = query(collection(firestore, "inventory"))
        const docs = await getDocs(snapshot)
        const inventoryList = []
        let totalQty = 0
        docs.forEach((doc) => {
            const data = doc.data();
            inventoryList.push({
                name: doc.id,
                ...data,
            });
            totalQty += data.quantity;
        });
        setInventory(inventoryList)
        setTotalQuantity(totalQty);
        handleCountProducts()
    }
    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const countProducts = async () => {
        const snapshot = await getDocs(collection(firestore, "inventory"));
        return snapshot.size;
    }
    const handleCountProducts = async () => {
        const count = await countProducts();
        setProductCount(count);
    };

    const removeItem = async (item, reduction) => {
        validateNumber(reduction)
        item = item.charAt(0).toUpperCase() + item.slice(1)
        const docRef = doc(collection(firestore, "inventory"), item)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const { quantity } = docSnap.data()
            if (quantity === 1) {
                await deleteDoc(docRef)
            } else {
                if (quantity < 1) { await deleteDoc(docRef) }
                else { await setDoc(docRef, { quantity: quantity - reduction }) }
            }
        }
        await updateInventory()
    }

    function validateNumber(varName) {
        varName = parseInt(varName, 10)
        if (isNaN(varName)) { varName = 0; }
    }

    const addItem = async (name, quantity) => {
        name = name.charAt(0).toUpperCase() + name.slice(1)
        const docRef = doc(collection(firestore, "inventory"), name)
        const docSnap = await getDoc(docRef)
        validateNumber(quantity)
        /*  quantity = parseInt(quantity, 10)
         if (isNaN(quantity)) {quantity = 0;} */

        if (docSnap.exists()) {
            const oldQuantity = docSnap.data().quantity
            validateNumber(oldQuantity)
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
        handleCountProducts()
    }, [handleCountProducts, updateInventory])

    const handleOpen = () => setOpen(true)
    const handleClosed = () => {
        setOpen(false)
        setIsEditing(false)
        setItemName("");
        setItemQuantity(1);
        setOriginalItemName("");
        setSearchQuery("")
    }

    return (


        <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" gap={2} flexDirection="column">
            <Box
                position="relative" marginTop="0.65%" width="800px" borderRadius={2}
                height="100px"
                bgcolor="#6798A2"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                padding={2}>
                <Typography variant="h3"> Stock management system </Typography></Box>.
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

                        <TextField id="outlined-number" label="Quantity" variant="outlined"
                            type="number" InputLabelProps={{ shrink: true, }}
                            InputProps={{ inputProps: { min: "1", step: "1" } }}
                            sx={{ width: "30%" }}
                            value={itemQuantity}
                            onChange={(e) => {
                                setItemQuantity(parseInt(e.target.value, 10) || 0)
                            }}

                        />

                        <Button
                            variant="outlined"
                            onClick={() => {
                                if (isEditing) {
                                    editItem(originalItemName, itemName, itemQuantity)
                                } else {
                                    addItem(itemName, itemQuantity)
                                }
                                handleClosed()  //check that originalitemnameis being set
                            }}
                        >{isEditing ? "Save" : "Add"}</Button>
                    </Stack>

                </Box>

            </Modal>


            <Box display="flex"
                justifyContent="space-between"
                alignItems="center"
                padding={3}
                width="800px"
                height="100px"

                border="5px solid #333"
            >
                <Button variant="contained"
                    sx={{ textAlign: "left" }}
                    onClick={() => {
                        handleOpen()
                    }}>
                    Add Item's
                </Button>

                <Button variant="contained"
                    sx={{ textAlign: "right" }}
                    onClick={removeAllItems}>
                    Clear database
                </Button>

                <Button variant="contained"
                    sx={{ textAlign: "right" }}
                    onClick={() => {
                        resetDB()
                    }}>
                    Reset database to default
                </Button>
            </Box>

            <Box border="5px solid #333" borderRadius="5px">
                <Box
                    width="800px"

                    height="100px"
                    bgcolor="#C9E4CA"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    padding={2}
                >
                    <Typography variant="h3" sx={{ textAlign: "left" }} color="#333">
                        Inventory Items:
                    </Typography>
                    <Box>
                        <Typography variant="h5">{productCount} Products</Typography>
                        <Typography variant="h5">{totalQuantity} Items</Typography>
                    </Box>
                    <TextField
                        id="standard-basic"
                        label="Search"
                        variant="standard"
                        sx={{ flexShrink: 0, width: "30%" }}
                        value={searchQuery}
                        overflow="auto"
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            //call search filtserz function
                        }}
                    />
                </Box>

                <Stack width="800px" height="300px" spacing={2} overflow="auto">
                    {
                        filteredInventory.map(({ name, quantity }) => (
                            <Box key={name} width="100%"
                                minHeight="150px" display="flex"
                                alignItems="center" justifyContent="space-between"
                                backgroundColor="#f0f0f0" padding={5}>
                                <Typography variant="h3" color="#333" maxWidth="50%"
                                    textAlign="center" sx={{
                                        overflow: "hidden", textOverflow: "ellipsis",
                                        wordBreak: "break-word", whiteSpace: "nowrap"
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