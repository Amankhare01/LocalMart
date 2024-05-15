import usermodel from "../models/usermodel.js";
import ordermodel from "../models/ordermodel.js";
import JWT from "jsonwebtoken";
import { hashPassword, comparepassword } from "../helpers/authhelper.js";
import shopmodel from "../models/shopmodel.js";
export const registercontroller = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "phone is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    const existinguser = await usermodel.findOne({ email });
    if (existinguser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    const hashedPassword = await hashPassword(password);
    const users = await new usermodel({
      name,
      email,
      password,
      phone,
      address,
      hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: "Registraion successfuly",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in registartion",
      error,
    });
  }
};

export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid username or password",
      });
    }
    const users = await usermodel.findOne({ email });
    if (!users) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    // const match = await comparepassword(password, users.password);
    // if (!match) {
    //     return res.status(200).send({
    //         success: false,
    //         message: "Invalid Password",
    //     });
    // }
    
    const token = await JWT.sign({ _id: users._id }, process.env.JWT_SEC, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfuly",
      users: {
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        role: users.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};

export const testcontroller = (req, res) => {
  res.send("Protected Route By Aman khare");
};

export const orderscontroller = async (req, res) => {
  try {
    const orders = await ordermodel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};
export const Allorderscontroller = async (req, res) => {
  try {
    const orders = await ordermodel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({createdAt:-1});
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

export const orderstatuscontroller=async(req,res)=>{
  try {
    const {orderId}= req.params;
    const {status}= req.body;
    const orders = await ordermodel.findByIdAndUpdate(
      orderId,
      {status},
      {new:true}
    );
    res.json(orders)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success:false,
      message:"Error while Updating status",
      error,
    })
  }
}

//shop reg

export const shopregistercontroller = async (req, res) => {
  try {
    const {shopname, name, email, password, phone, address } = req.body;
    if (!shopname) {
      return res.send({ message: "Shop Name is required" });
    }
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!phone) {
      return res.send({ message: "phone is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    const existinguser = await shopmodel.findOne({ email });
    if (existinguser) {
      return res.status(200).send({
        success: false,
        message: "Your Shop is already Register please login",
      });
    }
    const hashedPassword = await hashPassword(password);
    const shop = await new shopmodel({
      shopname,
      name,
      email,
      password,
      phone,
      address,
      hashedPassword,
    }).save();
    res.status(201).send({
      success: true,
      message: " Shop Registraion successfuly",
      shop,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in Shop registartion",
      error,
    });
  }
};

//shop login

export const shoplogincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid username or password",
      });
    }
    const shops = await shopmodel.findOne({ email });
    if (!shops) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    // const match = await comparepassword(password, users.password);
    // if (!match) {
    //     return res.status(200).send({
    //         success: false,
    //         message: "Invalid Password",
    //     });
    // }
    
    const token = await JWT.sign({ _id: shops._id }, process.env.JWT_SEC, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfuly",
      shops: {
        shopname: shops.name,
        name: shops.name,
        email: shops.email,
        phone: shops.phone,
        address: shops.address,
        role: shops.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in login",
      error,
    });
  }
};