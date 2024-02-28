import React, { useState, useEffect } from 'react';
import axios from 'axios';

const mockItems = [
    {
        title: 'Item 1',
        price: '100',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 2',
        price: '200',
        status: 'Inactive',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    },
    {
        title: 'Item 3',
        price: '300',
        status: 'Active',
        image: 'https://via.placeholder.com/150'
    }

];

const ListItems = () => {
    /* const [items, setItems] = useState(mockItems); // Initialize with mock data */
    const [selectedItems, setSelectedItems] = useState([]);

    /* const [loading, setLoading] = useState(false); // Add a loading state */

    const toggleItemSelection = (index) => {
        setSelectedItems(prevSelectedItems => {
            return prevSelectedItems.includes(index) ?
                prevSelectedItems.filter(itemIndex => itemIndex !== index) :
                [...prevSelectedItems, index];
        });
    };

const handleSkip = async () => {
    // Map selected indexes to their respective subIDs
    const selectedSubIDs = selectedItems.map(index => items[index].subID);

    try {
        const response = await axios.post('http://sns.home/skip-items', { items: selectedSubIDs });
        console.log(response.data); // Handle response

        // Update the items state based on the response
        setItems(items.map(item => {
            // Find the corresponding response for the current item
            const correspondingResponse = response.data.find(res => res.id === item.subID);

            // If a corresponding response was found and the item was skipped, update its status
            if (correspondingResponse && correspondingResponse.status === 'skipped') {
                return { ...item, status: 'Skipped' };
            }

            // Otherwise, return the item as is
            return item;
        }));

    } catch (error) {
        console.error('Error skipping items:', error);
        // Optional: Handle error (e.g., show an error message)
    }
};


    const [items, setItems] = useState([]);


    const [loading, setLoading] = useState(true); // Add a loading state

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true); // Begin loading
                const response = await axios.get(`http://sns.home/fetch-items`);
                setItems(response.data);
                setLoading(false); // End loading
            } catch (error) {
                console.error('Failed to fetch subscription items:', error);
                setLoading(false); // Ensure loading is ended even if there's an error
            }
        };

        fetchItems();
    }, []);

    return (
        <div>
            <button
                className={"mt-10 text-4xl bg-red-500 border-8 text-white border-gray-800"} onClick={handleSkip}>SKIP {selectedItems.length} ITEMS
            </button>
            <p
                className="mt-4 text-lg text-blue-500 cursor-pointer hover:underline"
                onClick={() => setSelectedItems([])}
            >
                Deselect all
            </p>
            <ul className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-10"}>
                {loading ? (
                    <li>Loading items...</li> // Show a loading indicator while fetching
                ) : (
                    Array.isArray(items) && items.map((item, index) =>
                        <li
                            key={index}
                            onClick={() => toggleItemSelection(index)}
                            className={`p-5 flex flex-col justify-center cursor-pointer ${selectedItems.includes(index) ? 'bg-red-600 bg-opacity-50 opacity-25' : 'bg-transparent'} hover:opacity-25`}
                        >
                            <img src={item.image} className={"h-[145px] w-[145px] m-auto"}></img>
                            <p className={"mt-3 font-bold"}>{item.title}</p>
                            <p className={"text-gray-400"}>{item.price}</p>
                            <p className={"text-sm"}>{item.status}</p>
                        </li>)
                )}
            </ul>
            <p
                className="mt-10 mb-4 text-lg text-blue-500 cursor-pointer hover:underline"
                onClick={() => setSelectedItems([])}
            >
                Deselect all
            </p>
            <button
                className={"text-4xl bg-red-500 border-8 text-white border-gray-800"} onClick={handleSkip}>SKIP {selectedItems.length} ITEMS
            </button>

        </div>
    );
};


export default ListItems;
