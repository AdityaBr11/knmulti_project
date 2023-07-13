module.exports = {
  helloScheduler : {
    frequency: "30 0 * * *",
    handler: "src/handlers/sayHello"
  },
  billScheduler : {
    frequency: "2 0 * * *",
    handler: "src/handlers/recurringBillScheduler"
  },
  invoiceScheduler : {
    frequency: "10 0 * * *",
    handler: "src/handlers/recurringInvoiceScheduler"
  },
  expenseScheduler : {
    frequency: "18 0 * * *",
    handler: "src/handlers/recurringExpenseScheduler"
  },
}