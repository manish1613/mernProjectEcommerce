import './App.css';
import { BrowserRouter as Router, Outlet, Route, Routes, Navigate } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import { useEffect, useState } from "react";
import Header from "./component/layout/Header/Header"
import Footer from './component/layout/Footer/Footer';
import Home from './component/Home/Home.js';
import ProductDetails from './component/Product/ProductDetails.js';
import Products from './component/Product/Products.js';
import Search from "./component/Product/Search.js";
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./component/layout/Header/UserOptions.js";
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import Loader from './component/layout/Loader/Loader';
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import ResetPassword from "./component/User/ResetPassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from "axios";
import Payment from "./component/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct.js";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews.js";
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound.js";

function App() {

  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  const Private = (isAdmin) => {

    if (loading === false) {
      if (isAuthenticated === false) {
        return <Navigate to="/login" />;
      }

      if (isAdmin === true && user.role !== "admin") {
        return <Navigate to="/login" />;
      }

      return <Outlet />;
    }
    else {
      return <Loader />
    }


  };

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
    getStripeApiKey();
  }, []);

  const Wrapper = ()=>{
        if(stripeApiKey){
         return <Elements stripe={loadStripe(stripeApiKey)}>
             <Payment/>
          </Elements>
        }
  }

  return (
    <Router>
      <Header />

      {isAuthenticated && <UserOptions user={user} />}

      {/* {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <ProtectedRoute exact path="/process/payment" component={Payment} />
        </Elements>
      )} */}
    

      <Routes>

        <Route exact path="/" element={<Home />} />

        <Route exact path="/contact" element={<Contact />} />

        <Route exact path="/about" element={<About />} />

        <Route exact path="/product/:id" element={<ProductDetails />} />

        <Route exact path="/products" element={<Products />} />

        <Route path="/products/:keyword" element={<Products />} />

        <Route exact path="/search" element={<Search />} />

        <Route exact path="/login" element={<LoginSignUp />} />

        <Route path="/account" element={<Private isAdmin={false} />}>
          <Route path="/account/" element={<Profile />} />
        </Route>

        <Route path="/me/update" element={<Private isAdmin={false} />}>
          <Route path="/me/update/" element={<UpdateProfile />} />
        </Route>

        <Route path="/password/update" element={<Private isAdmin={false} />}>
          <Route path="/password/update/" element={<UpdatePassword />} />
        </Route>


        <Route path="/password/forgot" element={<ForgotPassword />} />

        <Route path="/password/reset/:token" element={<ResetPassword />} />

        <Route exact path="/cart" element={<Cart/>} />

        <Route path="/login/shipping" element={<Private isAdmin={false} />}>
          <Route path="/login/shipping/" element={<Shipping />} />
        </Route>

        <Route path="/order/confirm" element={<Private isAdmin={false} />}>
          <Route path="/order/confirm/" element={<ConfirmOrder />} />
        </Route>

        <Route path="/process/payment" element={<Wrapper/>}/>

        <Route path="/success" element={<Private isAdmin={false} />}>
          <Route path="/success/" element={<OrderSuccess />} />
        </Route>

        <Route path="/orders" element={<Private isAdmin={false} />}>
          <Route path="/orders/" element={<MyOrders />} />
        </Route>

        <Route path="/order/:id" element={<Private isAdmin={false} />}>
          <Route path="/order/:id/" element={<OrderDetails />} />
        </Route>


        <Route path="/admin/dashboard" element={<Private isAdmin={true} />}>
          <Route path="/admin/dashboard/" element={<Dashboard />} />
        </Route>

        <Route path="/admin/products" element={<Private isAdmin={true} />}>
          <Route path="/admin/products/" element={<ProductList />} />
        </Route>

        <Route path="/admin/product" element={<Private isAdmin={true} />}>
          <Route path="/admin/product/" element={<NewProduct />} />
        </Route>

        <Route path="/admin/product/:id" element={<Private isAdmin={true} />}>
          <Route path="/admin/product/:id/" element={<UpdateProduct />} />
        </Route>

        <Route path="/admin/orders" element={<Private isAdmin={true} />}>
          <Route path="/admin/orders/" element={<OrderList />} />
        </Route>

        <Route path="/admin/order/:id" element={<Private isAdmin={true} />}>
          <Route path="/admin/order/:id/" element={<ProcessOrder />} />
        </Route>

        <Route path="/admin/users" element={<Private isAdmin={true} />}>
          <Route path="/admin/users/" element={<UsersList />} />
        </Route>

        <Route path="/admin/user/:id" element={<Private isAdmin={true} />}>
          <Route path="/admin/user/:id/" element={<UpdateUser />} />
        </Route>

        <Route path="/admin/reviews" element={<Private isAdmin={true} />}>
          <Route path="/admin/reviews/" element={<ProductReviews />} />
        </Route>
          


        

        
     





      </Routes>


      <Footer />
    </Router>

  );
}

export default App;
