import { useEffect, useState, useRef } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/logo-plain2-1.png";
import { Categories } from "../Categories";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase.config";
import { toast } from "react-toastify";
import {v4 as uuidv4} from 'uuid'
import Spinner from "../../components/Spinner";

const SellItem = () => {
 const [loading, setLoading] = useState(false);
 const [formData, setFormData] = useState({
   name: "",
   model: "",
   institutionCase: "",
   battery: "",
   condition: "",
   price: "",
   ram: "",
   processor: "",
   os: "",
   brand: "",
   rom: "",
   description: "",
   mobileNumber: "",
   categories: "",
   images: {},
 });
 const {
   model,
   processor,
   name,
   ram,
   rom,
   os,
   brand,
   price,
   condition,
   institutionCase,
   description,
   mobileNumber,
   categories,
   images,
 } = formData;

 let institution = institutionCase.toLowerCase()

 const auth = getAuth()
 const navigate = useNavigate()
 const isMounted = useRef(true)

 useEffect(() => {
   if (isMounted) {
     onAuthStateChanged(auth, (user) => {
       if (user) {
         setFormData({ ...formData, userRef: user.uid });
       } else {
         navigate("/login");
       }
     });
   }

   return () => {
     isMounted.current = false;
   };
   // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [isMounted])

 const submitForm = async (e) => {
   e.preventDefault();
   setLoading(true);
   if (images.length > 5) {
     setLoading(false);
     toast.error("Images should not exceed 5", { toastId: "gcyuch45ub657" });
     return;
   }

   const storeImage = async (image) => {
     return new Promise((resolve, reject) => {
       const storage = getStorage();
       const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

       const storageRef = ref(storage, "images/" + fileName);

       const uploadTask = uploadBytesResumable(storageRef, image);

       uploadTask.on(
         "state_changed",
         (snapshot) => {
           const progress =
             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
             console.log('Upload is ' + progress + '% done');
           switch (snapshot.state) {
             case "paused":
               break;
             case "running":
               break;
             default:
               break;
           }
         },
         (error) => {
           reject(error);
         },
         () => {
           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
             resolve(downloadURL);
           });
         }
       );
     });
   };

   const imgUrls = await Promise.all(
     [...images].map((image) => storeImage(image))
   ).catch(() => {
     setLoading(false);
     toast.error("Images not uploaded");
     return;
   });
   
   console.log(formDataCopy)
   const formDataCopy = {
     ...formData,
     imgUrls,
     institution,
     timestamp: serverTimestamp(),
    };
    
    delete formDataCopy.images;
    delete formDataCopy.institutionCase;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listings added successfully");
    navigate(`/institutionCase/${formDataCopy.institutionCase}/${
    formDataCopy.name || formDataCopy.model
    }/${docRef.id}`)
    setLoading(false)
  };

 const onChange = (e) => {
   if (e.target.files) {
     setFormData((prevState) => ({
       ...prevState,
       images: e.target.files,
     }));
   }
   if (!e.target.files) {
     setFormData((prevState) => ({
       ...prevState,
       [e.target.id]: e.target.value,
     }));
   }
 };

 if(loading) return <Spinner description='uploading...' />
  return (
    <section>
        <header className="bg-primaryBackground flex justify-center px-4 sticky">
          <Link to="/" className="mx-0 mb-6">
            <img src={Logo} alt="logo" className="h-16 mt-6" />
          </Link>
        </header>
      <div className="min-h-screen flex items-center justify-center py-16 mb-12 px-4 overflow-x-hidden">
        <div className="max-w-md w-full overflow-x-hidden">
          <form onSubmit={submitForm}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="relative">
                <select
                  id="categories"
                  name="categories"
                  className="caret-emerald-500 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  value={categories}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Categories</option>
                  <option value="mobile phones">mobile phones</option>
                  <option value="laptops">laptops</option>
                  <option value="furnitures">furnitures</option>
                  <option value="electronics">electronics</option>
                  <option value="others(specify)">others(specify)</option>
                </select>

                {categories === "mobile phones" && (
                  <>
                    <div className="mt-4 ">
                      <input
                        id="brand"
                        name="brand"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-purple-500 focus:z-10 sm:text-sm caret-emerald-500"
                        value={brand}
                        placeholder="e.g infinix, apple, samsung..."
                        onChange={onChange}
                      />
                    </div>

                    <div className="mt-4 ">
                      <input
                        id="model"
                        name="model"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-purple-500 focus:z-10 sm:text-sm caret-emerald-500"
                        value={model}
                        placeholder="e.g iphone x, infinix zero, samsung A20..."
                        onChange={onChange}
                      />
                    </div>

                    <div className="mt-4 ">
                      <label htmlFor="" className="sr-only">
                        condition
                      </label>
                      <select
                        id="condition"
                        name="condition"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={condition}
                        onChange={onChange}
                        required
                      >
                        <option>Condition</option>
                        <option>Brand New</option>
                        <option>Used</option>
                      </select>
                    </div>

                    <div className="mt-4 ">
                      <select
                        id="ram"
                        name="ram"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={ram}
                        onChange={onChange}
                        required
                      >
                        <option>RAM</option>
                        <option>512MB</option>
                        <option>1GB</option>
                        <option>2GB</option>
                        <option>3GB</option>
                        <option>4GB</option>
                        <option>6GB</option>
                        <option>8GB</option>
                        <option>12GB</option>
                      </select>
                      <select
                        id="rom"
                        name="rom"
                        className="appearance-none caret-emerald-500 rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={rom}
                        onChange={onChange}
                        required
                      >
                        <option>Internal Storage</option>
                        <option>32GB</option>
                        <option>64GB</option>
                        <option>128GB</option>
                        <option>256GB</option>
                        <option>512GB</option>
                      </select>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="email-address" className="sr-only">
                        Institution
                      </label>
                      <input
                        name="institutionCase"
                        id="institutionCase"
                        type="text"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={institutionCase}
                        placeholder="Institution"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        name="mobileNumber"
                        id="mobileNumber"
                        type="text"
                        size="13"
                        maxLength="11"
                        minLength="11"
                        required
                        className="appearance-none rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={mobileNumber}
                        placeholder="Mobile Number"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4 ">
                      <label htmlFor="email-address" className="sr-only">
                        price
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        min="1"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={price}
                        placeholder="Phone price"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4">
                      <label htmlFor="email-address" className="sr-only">
                        Describe Your Phone
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        className="appearance-none rounded-none caret-emerald-500 relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={description}
                        onChange={onChange}
                        placeholder="Description"
                      ></textarea>
                    </div>
                    <div className="mt-4 ">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Add photos. (maximum of 4) First image is the title
                        picture
                      </label>
                      <input
                        className="appearance-none rounded mt-2 relative block w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        type="file"
                        id="images"
                        placeholder="Upload images"
                        onChange={onChange}
                        max="4"
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Post
                        <span className="absolute right-4 inset-y-0 flex items-center pl-3">
                          <FaArrowCircleRight
                            className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                            color="white"
                          />
                        </span>
                      </button>
                    </div>
                  </>
                )}

                {categories === "laptops" && (
                  <>
                    <div className="mt-4 ">
                      <input
                        id="brand"
                        name="brand"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-purple-500 focus:z-10 sm:text-sm caret-emerald-500"
                        value={brand}
                        placeholder="brand e.g, Apple, Asus, HP..."
                        onChange={onChange}
                      />
                    </div>

                    <div className="mt-4 ">
                      <input
                        id="model"
                        name="model"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-purple-500 focus:z-10 sm:text-sm caret-emerald-500"
                        value={model}
                        placeholder="Model e.g Dell inspiton, MacBook, EliteBook..."
                        onChange={onChange}
                      />
                    </div>

                    <div className="mt-4 ">
                      <select
                        id="processor"
                        name="processor"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={processor}
                        onChange={onChange}
                        required
                      >
                        <option>Processor</option>
                        <option>Intel</option>
                        <option>Intel Celeron</option>
                        <option>Intel Pentium</option>
                        <option>Intel Core i3</option>
                        <option>Intel Core i5</option>
                        <option>Intel Core i7</option>
                        <option>AMD</option>
                        <option>AMD A6</option>
                        <option>AMD A10</option>
                      </select>
                    </div>

                    <div className="mt-4 ">
                      <select
                        id="condition"
                        name="condition"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={condition}
                        onChange={onChange}
                        required
                      >
                        <option>Condition</option>
                        <option>Brand New</option>
                        <option>Used</option>
                      </select>
                    </div>

                    <div className="mt-4 ">
                      <select
                        id="ram"
                        name="ram"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={ram}
                        onChange={onChange}
                        required
                      >
                        <option>RAM</option>
                        <option>1GB</option>
                        <option>2GB</option>
                        <option>3GB</option>
                        <option>4GB</option>
                        <option>6GB</option>
                        <option>8GB</option>
                        <option>12GB</option>
                        <option>16GB</option>
                        <option>24GB</option>
                        <option>32GB</option>
                        <option>48GB</option>
                        <option>64GB</option>
                        <option>256GB</option>
                      </select>
                      <select
                        id="rom"
                        name="rom"
                        className="appearance-none caret-emerald-500 rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={rom}
                        onChange={onChange}
                        required
                      >
                        <option>Internal Storage</option>
                        <option>16GB</option>
                        <option>32GB</option>
                        <option>40GB</option>
                        <option>128GB</option>
                        <option>140GB</option>
                        <option>256GB</option>
                        <option>320GB</option>
                        <option>350GB</option>
                        <option>500GB</option>
                        <option>512GB</option>
                        <option>700GB</option>
                        <option>1TB</option>
                        <option>1.5TB</option>
                        <option>2TB</option>
                        <option>3TB</option>
                      </select>
                    </div>

                    <div className="mt-4 ">
                      <select
                        id="os"
                        name="os"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={os}
                        onChange={onChange}
                        required
                      >
                        <option>Operating System</option>
                        <option>1GB</option>
                        <option>Window 7</option>
                        <option>Window 8</option>
                        <option>Window 10</option>
                        <option>Window 11</option>
                        <option>Window XP</option>
                        <option>Ubuntu</option>
                        <option>Mac Os</option>
                        <option>Linux</option>
                      </select>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="email-address" className="sr-only">
                        Institution
                      </label>
                      <input
                        name="institutionCase"
                        id="institutionCase"
                        type="text"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={institutionCase}
                        placeholder="Institution"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        name="mobileNumber"
                        id="mobileNumber"
                        type="text"
                        size="13"
                        maxLength="11"
                        minLength="11"
                        required
                        className="appearance-none rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={mobileNumber}
                        placeholder="Mobile Number"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4 ">
                      <label htmlFor="email-address" className="sr-only">
                        price
                      </label>
                      <input
                        name="price"
                        id="price"
                        type="number"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={price}
                        placeholder="Price"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4">
                      <label htmlFor="email-address" className="sr-only">
                        Describe Your Phone
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        className="appearance-none rounded-none caret-emerald-500 relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={description}
                        onChange={onChange}
                        placeholder="Description"
                      ></textarea>
                    </div>
                    <div className="mt-4 ">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Upload images(maximum of 4)
                      </label>
                      <input
                        className="appearance-none rounded mt-2 relative block w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        type="file"
                        id="images"
                        placeholder="Upload images"
                        onChange={onChange}
                        max="4"
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Sell it
                        <span className="absolute right-4 inset-y-0 flex items-center pl-3">
                          <FaArrowCircleRight
                            className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                            color="white"
                          />
                        </span>
                      </button>
                    </div>
                  </>
                )}
                {categories === "furnitures" && (
                  <>
                    <div className="mt-4 ">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-purple-500 focus:z-10 sm:text-sm caret-emerald-500"
                        value={name}
                        placeholder="Name e.g Table, Chair, Mattress..."
                        onChange={onChange}
                      />
                    </div>

                    <div className="mt-4 ">
                      <select
                        id="condition"
                        name="condition"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={condition}
                        onChange={onChange}
                        required
                      >
                        <option>Condition</option>
                        <option>Brand New</option>
                        <option>Used</option>
                      </select>
                    </div>

                    <div className="mt-4">
                      <label htmlFor="email-address" className="sr-only">
                        Institution
                      </label>
                      <input
                        name="institutionCase"
                        id="institutionCase"
                        type="text"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={institutionCase}
                        placeholder="Institution"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        name="mobileNumber"
                        id="mobileNumber"
                        type="text"
                        size="13"
                        maxLength="11"
                        minLength="11"
                        required
                        className="appearance-none rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={mobileNumber}
                        placeholder="Mobile Number"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4 ">
                      <input
                        name="price"
                        id="price"
                        type="number"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={price}
                        placeholder="Price"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4">
                      <textarea
                        id="description"
                        name="description"
                        className="appearance-none rounded-none caret-emerald-500 relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={description}
                        onChange={onChange}
                        placeholder="Description"
                      ></textarea>
                    </div>
                    <div className="mt-4 ">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Upload images(maximum of 4)
                      </label>
                      <input
                        className="appearance-none rounded mt-2 relative block w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        type="file"
                        id="images"
                        placeholder="Upload images"
                        onChange={onChange}
                        max="4"
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Post
                      </button>
                    </div>
                  </>
                )}

                {categories === "electronics" && (
                  <>
                    <div className="mt-4 ">
                      <input
                        id="brand"
                        name="brand"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-purple-500 focus:z-10 sm:text-sm caret-emerald-500"
                        value={brand}
                        placeholder="brand e.g JBL, LG, Sony..."
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4 ">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-purple-500 focus:z-10 sm:text-sm caret-emerald-500"
                        value={name}
                        placeholder="Name e.g Television, Sound Systems, Speakers..."
                        onChange={onChange}
                      />
                    </div>

                    <div className="mt-4 ">
                      <select
                        id="condition"
                        name="condition"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={condition}
                        onChange={onChange}
                        required
                      >
                        <option>Condition</option>
                        <option>Brand New</option>
                        <option>Used</option>
                      </select>
                    </div>

                    <div className="mt-4">
                      <input
                        name="institutionCase"
                        id="institutionCase"
                        type="text"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={institutionCase}
                        placeholder="Institution"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        name="mobileNumber"
                        id="mobileNumber"
                        type="text"
                        size="13"
                        maxLength="11"
                        minLength="11"
                        required
                        className="appearance-none rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={mobileNumber}
                        placeholder="Mobile Number"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4 ">
                      <input
                        name="price"
                        id="price"
                        type="number"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={price}
                        placeholder="Price"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4">
                      <textarea
                        id="description"
                        name="description"
                        className="appearance-none rounded-none caret-emerald-500 relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={description}
                        onChange={onChange}
                        placeholder="Description"
                      ></textarea>
                    </div>
                    <div className="mt-4 ">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Upload images(maximum of 4)
                      </label>
                      <input
                        className="appearance-none rounded mt-2 relative block w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        type="file"
                        id="images"
                        placeholder="Upload images"
                        onChange={onChange}
                        max="4"
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Post
                      </button>
                    </div>
                  </>
                )}

                {categories === "others(specify)" && (
                  <>
                    <div className="mt-4 ">
                      <input
                        id="brand"
                        name="brand"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-purple-500 focus:z-10 sm:text-sm caret-emerald-500"
                        value={brand}
                        placeholder="brand"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4 ">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-purple-500 focus:z-10 sm:text-sm caret-emerald-500"
                        value={name}
                        placeholder="Name of product"
                        onChange={onChange}
                      />
                    </div>

                    <div className="mt-4 ">
                      <select
                        id="condition"
                        name="condition"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={condition}
                        onChange={onChange}
                        required
                      >
                        <option>Condition</option>
                        <option>Brand New</option>
                        <option>Used</option>
                      </select>
                    </div>

                    <div className="mt-4">
                      <input
                        name="institutionCase"
                        id="institutionCase"
                        type="text"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={institutionCase}
                        placeholder="Institution"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        name="mobileNumber"
                        id="mobileNumber"
                        type="text"
                        size="13"
                        maxLength="11"
                        minLength="11"
                        required
                        className="appearance-none rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={mobileNumber}
                        placeholder="Mobile Number"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4 ">
                      <input
                        name="price"
                        id="price"
                        type="number"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={price}
                        placeholder="Price"
                        onChange={onChange}
                      />
                    </div>
                    <div className="mt-4">
                      <textarea
                        id="description"
                        name="description"
                        className="appearance-none rounded-none caret-emerald-500 relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={description}
                        onChange={onChange}
                        placeholder="Description"
                      ></textarea>
                    </div>
                    <div className="mt-4 ">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Upload images(maximum of 4)
                      </label>
                      <input
                        className="appearance-none rounded mt-2 relative block w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        type="file"
                        id="images"
                        placeholder="Upload images"
                        onChange={onChange}
                        max="4"
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Post
                      </button>
                    </div>
                  </>
                )}

                {categories === "" && (
                  <>
                    <div className="mt-4 ">
                      <select
                        id="condition"
                        name="condition"
                        className="appearance-none rounded-none relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={condition}
                        onChange={onChange}
                        required
                        disabled={categories === ""}
                      >
                        <option>Condition</option>
                        <option>Brand New</option>
                        <option>Used</option>
                      </select>
                    </div>

                    <div className="mt-4">
                      <input
                        name="institutionCase"
                        id="institutionCase"
                        type="text"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={institutionCase}
                        placeholder="Institution"
                        onChange={onChange}
                        disabled={categories === ""}
                      />
                    </div>
                    <div className="mt-4">
                      <input
                        name="mobileNumber"
                        id="mobileNumber"
                        type="text"
                        size="13"
                        maxLength="11"
                        minLength="11"
                        required
                        className="appearance-none rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={mobileNumber}
                        placeholder="Mobile Number"
                        onChange={onChange}
                        disabled={categories === ""}
                      />
                    </div>
                    <div className="mt-4 ">
                      <input
                        name="price"
                        id="price"
                        type="number"
                        required
                        className="appearance-none caret-emerald-500 rounded-none mt-2 relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={price}
                        placeholder="Price"
                        onChange={onChange}
                        disabled={categories === ""}
                      />
                    </div>
                    <div className="mt-4">
                      <textarea
                        id="description"
                        name="description"
                        className="appearance-none rounded-none caret-emerald-500 relative block w-full px-3 py-2 mt-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        value={description}
                        onChange={onChange}
                        placeholder="Description"
                        disabled={categories === ""}
                      ></textarea>
                    </div>
                    <div className="mt-4 ">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Upload images(maximum of 4)
                      </label>
                      <input
                        className="appearance-none rounded mt-2 relative block w-full border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                        type="file"
                        id="images"
                        placeholder="Upload images"
                        onChange={onChange}
                        max="4"
                        accept=".jpg,.png,.jpeg"
                        multiple
                        required
                        disabled={categories === ""}
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Post
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}


export default SellItem
