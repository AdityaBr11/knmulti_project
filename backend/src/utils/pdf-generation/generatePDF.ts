import { IVendorBill } from "../../db/schema/vendorBill";

var pdf = require('dynamic-html-pdf');
import fs from "fs";
import { Router } from "express";
import path from "path";
import { DeliveryChallan } from "../../models";

const generatePDFRouter = Router();

export const generateBillPDF = async (billData: any) => {

  try {
    const html = fs.readFileSync(path.join(__dirname , "Bill_Template.html"), "utf8");
    pdf.registerHelper('ifCond', function (this:any, v1: any, v2: any, options: any,) {
      if (v1 === v2) {
          return options.fn(this);
      }
      return options.inverse(this);
    })
  
    const options = {
        format: "A2",
        orientation: "portrait",
        border: "5mm",
        childProcessOptions: {
          env: {
            OPENSSL_CONF: '/dev/null',
          },
        }
    };
    const document = {
      type: 'file',     // 'file' or 'buffer'
      template: html,
      context: {
        billData : billData,
      },
      path: path.join(__dirname , `generated/${billData._id}.pdf`),
    };
    const res = await pdf.create(document, options);
    console.log("FILE CREATED")
    return document.path;
  } catch (error) {
    console.log(error);
  }
  
};

export const generatePurchaseOrderPDF = async (purchaseOrderData: any) => {
  const html = fs.readFileSync(path.join(__dirname , "Purchase_Order_Template.html"), "utf8");
  pdf.registerHelper('ifCond', function (this:any, v1: any, v2: any, options: any,) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
  })

  const options = {
      format: "A2",
      orientation: "portrait",
      border: "5mm",
      childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null',
        },
      }
  };
  const document = {
    type: 'file',     // 'file' or 'buffer'
    template: html,
    context: {
      purchaseOrderData : purchaseOrderData,
    },
    path: path.join(__dirname , `generated/${purchaseOrderData._id}.pdf`),
  };
  const res = await pdf.create(document, options);
  console.log("FILE CREATED")
  return document.path;
};

export const generateVendorCreditPDF = async (creditData: any) => {
  try {
    const html = fs.readFileSync(path.join(__dirname , "Vendor_Credit_Template.html"), "utf8");
    pdf.registerHelper('ifCond', function (this:any, v1: any, v2: any, options: any,) {
      if (v1 === v2) {
          return options.fn(this);
      }
      return options.inverse(this);
    })
  
    const options = {
        format: "A2",
        orientation: "portrait",
        border: "5mm",
        childProcessOptions: {
          env: {
            OPENSSL_CONF: '/dev/null',
          },
        }
    };
    const document = {
      type: 'file',     // 'file' or 'buffer'
      template: html,
      context: {
        creditData : creditData,
      },
      path: path.join(__dirname , `generated/${creditData._id}.pdf`),
    };    
    const res = await pdf.create(document, options);
    console.log("FILE CREATED");
    return document.path;
  } catch (error) {
    console.log(error)
  }
    
};

export const generatePurchaseMadePDF = async (payInfo: any) => {
  const html = fs.readFileSync(path.join(__dirname , "Purchase_Made_Template.html"), "utf8");
  pdf.registerHelper('ifCond', function (this:any, v1: any, v2: any, options: any,) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
  })

  const options = {
      format: "A2",
      orientation: "portrait",
      border: "5mm",
      childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null',
        },
      }
  };
  const document = {
    type: 'file',     // 'file' or 'buffer'
    template: html,
    context: {
      payInfo : payInfo,
    },
    path: path.join(__dirname , `generated/${payInfo._id}.pdf`),
  };
  const res = await pdf.create(document, options);
  console.log("FILE CREATED")
  return document.path;
};

export const generateSaleEstimatePDF = async (estimate: any) => {
  try {
    const html = fs.readFileSync(path.join(__dirname , "Sale_Estimate_Template.html"), "utf8");
    pdf.registerHelper('ifCond', function (this:any, v1: any, v2: any, options: any,) {
      if (v1 === v2) {
          return options.fn(this);
      }
      return options.inverse(this);
    })
  
    const options = {
        format: "A2",
        orientation: "portrait",
        border: "5mm",
        childProcessOptions: {
          env: {
            OPENSSL_CONF: '/dev/null',
          },
        }
    };
    const document = {
      type: 'file',     // 'file' or 'buffer'
      template: html,
      context: {
        saleEstimateData : estimate,
        estimateDate: JSON.stringify(estimate.estimateDate).slice(1,11)
      },
      path: path.join(__dirname , `generated/${estimate._id}.pdf`),
    };
    const res = await pdf.create(document, options);
    console.log("FILE CREATED")
    return document.path;
  } catch (e) {
    console.log(e);
    return '';
  }
};

export const generateSalesOrderPDF = async (order: any) => {
  const html = fs.readFileSync(path.join(__dirname , "Sale_Order_Template.html"), "utf8");
  pdf.registerHelper('ifCond', function (this:any, v1: any, v2: any, options: any,) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
  })

  const options = {
      format: "A2",
      orientation: "portrait",
      border: "5mm",
      childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null',
        },
      }
  };
  const document = {
    type: 'file',     // 'file' or 'buffer'
    template: html,
    context: {
      saleOrderData : order,
      orderDate: JSON.stringify(order.orderDate).slice(1,11)
    },
    path: path.join(__dirname , `generated/${order._id}.pdf`),    // it is not required if type is buffer
  };
  
  console.log('executing function')
  const res = await pdf.create(document, options);
  console.log("FILE CREATED")
  return document.path;
};

export const generateDeliveryChallanPDF = async (challan: any) => {
  const html = fs.readFileSync(path.join(__dirname , "Delivery_Challan_Template.html"), "utf8");
  pdf.registerHelper('ifCond', function (this: any, v1: any, v2: any, options: any,) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
  })

  const options = {
      format: "A2",
      orientation: "portrait",
      border: "5mm",
      childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null',
        },
      }
  };
  const document = {
    type: 'file',     // 'file' or 'buffer'
    template: html,
    context: {
      deliveryChallan : challan,
    },
    path: path.join(__dirname , `generated/${challan._id}.pdf`),    // it is not required if type is buffer
  };
  console.log('new pdf')
  const res = await pdf.create(document, options);
  console.log("FILE CREATED")
  return document.path;
};

export const generateCreditNotePDF = async (note: any) => {
  const html = fs.readFileSync(path.join(__dirname , "Credit_Note_Template.html"), "utf8");
  const options = {
      format: "A2",
      orientation: "portrait",
      border: "5mm",
      childProcessOptions: {
        env: {
          OPENSSL_CONF: '/dev/null',
        },
      }
  };
  const document = {
    type: 'file',     // 'file' or 'buffer'
    template: html,
    context: {
      creditNoteData: note,
      creditDate:JSON.stringify(note?.creditDate).slice(1,11)
    },
    path: path.join(__dirname , `generated/${note._id}.pdf`),    // it is not required if type is buffer
  };
  const res = await pdf.create(document, options);
  console.log("FILE CREATED creditNoteData")
  return document.path;
};

export const generateSaleInvoicePDF = async (invoice: any) => {
  const html = fs.readFileSync(path.join(__dirname , "Sale_Invoice_Template.html"), "utf8");
  const document = {
    type: 'file',     // 'file' or 'buffer'
    template: html,
    context: {
      saleInvoiceData : invoice,
      invoiceDate:JSON.stringify(invoice.invoiceDate).slice(1,11),
    },
    path: path.join(__dirname , `generated/${invoice._id}.pdf`),
  };
  
  const options = {
    format: "A2",
    orientation: "portrait",
    border: "5mm",
    childProcessOptions: {
      env: {
        OPENSSL_CONF: '/dev/null',
      },
    }
  };
  const res = await pdf.create(document, options);
  console.log("FILE CREATED11")
  return document.path;
};

export const generateSalePayment = async (payment: any) => {
  const html = fs.readFileSync(path.join(__dirname , "Sale_Payment_Template.html"), "utf8");
  const document = {
    type: 'file',     // 'file' or 'buffer'
    template: html,
    context: {
      salePayment : payment,
      paymentDate: JSON.stringify(payment?.paymentDate).slice(1,11)
    },
    path: path.join(__dirname , `generated/${payment._id}.pdf`),
  };
  
  const options = {
    format: "A2",
    orientation: "portrait",
    border: "5mm",
    childProcessOptions: {
      env: {
        OPENSSL_CONF: '/dev/null',
      },
    }
  };
  const res = await pdf.create(document, options);
  console.log("FILE CREATED")
  return document.path;
};


export default generatePDFRouter;
