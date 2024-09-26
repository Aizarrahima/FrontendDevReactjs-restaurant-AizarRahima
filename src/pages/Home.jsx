import React, { useState, useEffect } from "react";
import { FaCircle } from "react-icons/fa";
import { IoStar, IoStarOutline } from "react-icons/io5";

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [openNow, setOpenNow] = useState(false);
    const [priceFilter, setPriceFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [restaurantDisplayed, setRestaurantDisplayed] = useState([]);
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetch('https://restaurant-api.dicoding.dev/list')
            .then(response => response.json())
            .then(data => {
                console.log(data.restaurants);
                setRestaurants(data.restaurants);
                setRestaurantDisplayed(data.restaurants.slice(0, 8));
            });
    }, []);

    const filterRestaurants = () => {
        let filteredRestaurants = restaurants;

        if (openNow) {
            filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.open_now);
        }

        if (priceFilter) {
            let minRating = 0;
            let maxRating = 5;

            // rating-based price filter
            switch (priceFilter) {
                case '$':
                    maxRating = 1;
                    break;
                case '$$':
                    minRating = 2;
                    maxRating = 3;
                    break;
                case '$$$':
                    minRating = 3;
                    maxRating = 4;
                    break;
                case '$$$$':
                    minRating = 4;
                    maxRating = 5;
                    break;
                case '$$$$$':
                    minRating = 5;
                    break;
                default:
                    break;
            }

            filteredRestaurants = filteredRestaurants.filter(
                restaurant => restaurant.rating >= minRating && restaurant.rating <= maxRating
            );
        }

        if (categoryFilter) {
            filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.city === categoryFilter);
        }

        setRestaurantDisplayed(filteredRestaurants);
    };

    useEffect(() => {
        filterRestaurants();
    }, [openNow, priceFilter, categoryFilter]);

    const handleOpenNowChange = () => {
        setOpenNow(!openNow);
    };

    const handlePriceChange = (e) => {
        setPriceFilter(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setCategoryFilter(e.target.value);
    };

    const handleLoadMore = () => {
        const currentLength = restaurantDisplayed.length;
        const newLength = currentLength + 4;
        setRestaurantDisplayed(restaurants.slice(0, newLength));
    };

    const handleClearFilters = () => {
        setOpenNow(false);
        setPriceFilter('');
        setCategoryFilter('');
        setRestaurantDisplayed(restaurants.slice(0, 8));
    };

    const fetchDetailRestaurant = (restaurantId) => {
        fetch(`https://restaurant-api.dicoding.dev/detail/${restaurantId}`)
            .then(response => response.json())
            .then(data => {
                setModalData(data.restaurant);
                setIsModalOpen(true);
            });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };


    return (
        <div className="px-10">
            {/* Header */}
            <div className="py-4">
                <h1 className="font-light">Restaurant</h1>
                <h5 className="max-w-3xl py-4 font-normal text-neutral-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, expedita harum soluta cum reiciendis dolore. Soluta, voluptatum, rem libero suscipit vel quo facere, laboriosam voluptatem alias sint illum nihil ipsam.
                </h5>
            </div>

            {/* Filtering */}
            <div className="flex flex-row justify-between w-full py-5">
                <div className="flex items-center gap-3">
                    <p>Filter By:</p>
                    <div>
                        <input
                            type="checkbox"
                            id="openNow"
                            className=""
                            onChange={handleOpenNowChange}
                            checked={openNow}
                        />
                        <label htmlFor="openNow" className="ml-1 text-sm select-none">
                            Open Now
                        </label>
                    </div>
                    <div>
                        <select
                            name="price"
                            id="price"
                            defaultValue=""
                            className="border-b-[0.4px] text-[var(--primary-color)] text-sm border-black focus:outline-none"
                            onChange={handlePriceChange}
                            value={priceFilter}
                        >
                            <option value=''>Price</option>
                            <option value="$">$</option>
                            <option value="$$">$$</option>
                            <option value="$$$">$$$</option>
                            <option value="$$$$">$$$$</option>
                            <option value="$$$$$">$$$$$</option>
                        </select>
                    </div>
                    <div>
                        <select
                            name="categoryFilter"
                            id="categoryFilter"
                            className="border-b-[0.4px] text-[var(--primary-color)] text-sm border-black focus:outline-none"
                            onChange={handleCategoryChange}
                            value={categoryFilter}
                        >
                            <option value=''>Category</option>
                            <option value="Medan">Medan</option>
                            <option value="Surabaya">Surabaya</option>
                            <option value="Aceh">Aceh</option>
                            <option value="Gorontalo">Gorontalo</option>
                            <option value="Balikpapan">Balikpapan</option>
                            <option value="Bandung">Bandung</option>
                        </select>
                    </div>
                </div>
                <div>
                    <button
                        className="px-4 py-2 font-bold btn outline outline-2 outline-[var(--primary-color)] text-[var(--primary-color)]"
                        onClick={handleClearFilters}
                    >
                        Clear All
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <h2 className="font-light">All Restaurants</h2>
            </div>

            {/* Card */}
            <div className="grid w-full grid-cols-1 gap-8 py-4 lg:grid-cols-4">
                {restaurantDisplayed.map((restaurant, index) => (
                    <div key={index}>
                        <div className="w-full h-[260px] bg-neutral-300">
                            <img
                                src={`https://restaurant-api.dicoding.dev/images/small/${restaurant.pictureId}`}
                                alt="restaurant img"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        {/* rating */}
                        <div className="py-4">
                            <h4 className="font-medium text-limit">{restaurant.name}</h4>
                            <div className="flex gap-[2px]">
                                {Array.from({ length: 5 }, (_, starIndex) => {
                                    const starValue = starIndex + 1;
                                    return starValue <= Math.floor(restaurant.rating) ? (
                                        <IoStar key={starIndex} style={{ color: '#130d5c' }} />
                                    ) : (
                                        <IoStarOutline key={starIndex} className="text-neutral-300" />
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <div>
                                <div className="flex items-center">
                                    <p className="text-xs text-neutral-500 pr-1">Price:</p>
                                    {Array.from({ length: 5 }, (_, priceIndex) => {
                                        const priceValue = priceIndex + 1;
                                        return priceValue <= Math.floor(restaurant.rating) ? (
                                            <p className="text-xs">$</p>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    {restaurant.open_now ?
                                        <div className="flex items-center gap-2">
                                            <FaCircle className="text-green-500" style={{ width: '10px', height: '10px' }} />
                                            <p className="text-xs">Open</p>
                                        </div>
                                        :
                                        <div className="flex items-center gap-2">
                                            <FaCircle className="text-red-500" style={{ width: '10px', height: '10px' }} />
                                            <p className="text-xs">Closed</p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="mt-4 btn btn-primary">
                                <p className="text-sm font-bold tracking-wider" onClick={() => fetchDetailRestaurant(restaurant.id)}>Learn More</p>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* load more */}
            <div className="pb-4 mt-4 text-center">
                <button className="px-32 py-3 border border-black" onClick={handleLoadMore}>Load More</button>
            </div>

            {/* Modal Detail */}
            {isModalOpen && (
                <div
                    id="modal_detail"
                    tabIndex="-1"
                    className="overflow-y-auto inset-0 fixed top-0 left-0 right-0 z-50 w-full h-50 flex items-center justify-center bg-black bg-opacity-50" >
                    <div className="relative w-full max-w-lg border-2 border-gray-500 rounded-lg shadow-2xl">
                        <div className="relative bg-white rounded-lg">
                            <div className="flex items-center justify-between px-5 py-3 border-b rounded-t border-gray-500">
                                <h3 className="text-xl pt-2 font-medium text-gray-900 ">
                                    Detail
                                </h3>
                                <button type="button" className="text-gray-400 bg-transparent hover:bg-red-500 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:text-white" data-modal-hide="medium-modal" onClick={() => handleCloseModal()}>
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[80vh]">
                                <div className="flex flex-col items-center">
                                    <img
                                        className="rounded-md"
                                        alt={modalData ? modalData.name : 'not found'}
                                        src={modalData ? `https://restaurant-api.dicoding.dev/images/small/${modalData.pictureId}` : ''}
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                    />
                                </div>
                                <div className="px-2 py-4">
                                    <div className="font-bold text-2xl mb-2">
                                        {modalData.name}
                                    </div>
                                    <div className="flex gap-[2px] mb-4">
                                        {Array.from({ length: 5 }, (_, starIndex) => {
                                            const starValue = starIndex + 1;
                                            return starValue <= Math.floor(modalData.rating) ? (
                                                <IoStar key={starIndex} style={{ color: '#130d5c' }} />
                                            ) : (
                                                <IoStarOutline key={starIndex} className="text-neutral-300" />
                                            );
                                        })}
                                    </div>
                                    <p className="text-black-700 text-base">
                                        {modalData.description}
                                    </p>
                                </div>
                                <div className="pb-3 px-2">
                                    <h3 className="text-xl pt-2 font-medium text-gray-900">
                                        Reviews
                                    </h3>
                                    <div className="container py-3">
                                        <ul className="flex flex-col gap-4">
                                            {modalData.customerReviews.map((review) => (
                                                <li className="flex items-center gap-4">
                                                    <div className="w-12 h-12 overflow-hidden rounded-full">
                                                        <img
                                                            src={`https://ui-avatars.com/api/?name=${review.name}`}
                                                            alt=""
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h5>{review.name}</h5>
                                                        <p className="text-sm">{review.review}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
