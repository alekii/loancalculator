//global variables
const calcBtn = document.getElementById("calculateBtn");
const formArea = document.getElementById("formarea");
const form = document.getElementById("form");
const label = document.getElementById("label");
const resultsArea = document.getElementById("results");

let checkErrors = false;
// set interest rate to 2%
const INTEREST = 0.02;
let loanInterest;
let totalInsurance;

disableCalc();

document.getElementById("amount").addEventListener("blur", validateAmount);
document.getElementById("months").addEventListener("blur", validateMonths);

function validateAmount() {
  const input = document.getElementById("amount");
  const amountValidator = /^\d{1,6}$/;

  if (!amountValidator.test(input.value)) {
    showInputError("Amount should be between 1 and 150000", label);
    disableCalc();
  } else {
    enableCalc();
  }
}
function validateMonths() {
  const input = document.getElementById("months");
  const monthsValidator = /^([1-9]|1[0-8])$/;

  if (!monthsValidator.test(input.value)) {
    showInputError("Months should be between 1 and 18", calcBtn);
    disableCalc();
  } else {
    enableCalc();
  }
}

//show input errors below
function showInputError(error, element) {
  const errorText = document.createElement("p");
  errorText.innerText = error;
  errorText.style.color = "rgb(30,255,0)";
  errorText.style.marginTop = "17px";
  errorText.style.marginBottom = "17px";
  errorText.style.fontSize = "14px";
  form.insertBefore(errorText, element);
  disableCalc();
  setTimeout(() => {
    form.removeChild(errorText);
  }, 2000);
}

//listen to the submit event when user clicks on calculate button
document.getElementById("formarea").addEventListener("submit", function (e) {
  //simulates resource being pulled from the server
  calcBtn.value = "working...";
  setTimeout(calculateLoan, 1000);
  e.preventDefault();
});

//get the results
function calculateLoan() {
  checkErrors = false;
  // the loan insurance is 3% of the loan amount computed once
  let INSURANCE;

  // declare variables we'll use in the final calculation
  let totalLoan;

  calcBtn.value = "Calculate";

  //get user input
  const amount = document.getElementById("amount").value;
  const months = document.getElementById("months").value;

  //get constants where to display results after calculation is done
  const totalInstallment = document.getElementById("totalInstallment");
  const monthlyInstallment = document.getElementById("monthlyinstallment");
  const weeklyInstallment = document.getElementById("weeklyinstallment");

  //convert user input to numeric
  const loanAmount = parseFloat(amount);
  const period = parseFloat(months); 
  if (loanAmount < 1000 && period > 1) {
    showError("Loan below 1,000 should be repaid in 1 Month");
  }
   else if (loanAmount >= 1000 && loanAmount < 2000 && period > 3) {
    showError("Loan below 2,000 should be repaid in 3 Months");
  }
   else if (loanAmount <= 2000 && loanAmount < 20000 && period > 9) {
    showError("Loan below 20,000 should be repaid in 9 Months");
  } else if (period > 18) {
    showError("All loans should be repaid in 18 Months");
  } else if (loanAmount < 100000 && period > 12) {
    showError("Loans below 10,0000 should be paid in 12 months");
  } else if (loanAmount > 150000) {
    showError("Sorry, we do not offer loans above 150,000");
  }

  //nested if statement
  //if above error is not present then proceed.
  if (!checkErrors) {
    if (period === 1 || loanAmount <1000) {
      //there is no interest charged on loans that are to be repaid in one month
      totalLoan = loanAmount;
    } else if (loanAmount >=1000 && loanAmount < 2000) {
      INSURANCE = 50;
      loanInterest = loanAmount * period * INTEREST;
      totalInsurance = loanAmount + INSURANCE;
      totalLoan = loanInterest + totalInsurance;
    } else if (loanAmount >= 2000 && loanAmount < 20000) {
      INSURANCE = 0.03;
      totalLoan = getLoanTotal(loanAmount, INSURANCE, period);
    } else if (loanAmount >= 20000) {
      INSURANCE = 0.04;
      totalLoan = getLoanTotal(loanAmount, INSURANCE, period);
    }

    //Now do the final calculation. Check if totalLoan is quantifiable
    if (isFinite(totalLoan)) {
      totalInstallment.value = totalLoan.toFixed(2);
      monthlyInstallment.value = (totalLoan / period).toFixed(2);
      weeklyInstallment.value = (totalLoan / period / 3).toFixed(2);
    }
    //reveal results to the user
    resultsArea.style.display = "block";

    //Event to re-enable calculate button to work after getting results on screen
    disableCalc();
    calcListener();
  }
}

//Calculates the total Loan amount
function getLoanTotal(loanAmount, insurance, period) {
  loanInterest = loanAmount * period * INTEREST;
  totalInsurance = loanAmount * insurance;
  return loanAmount + loanInterest + totalInsurance;
}

//Listens to the keydown event that will enable calculate button
function calcListener() {
  document.getElementById("amount").addEventListener("keyup", enableCalc);
  document.getElementById("months").addEventListener("keyup", enableCalc);
}
//enable calculate button after user changes input
function enableCalc() {
  calcBtn.style.cursor = "pointer";
  calcBtn.disabled = false;
  resultsArea.style.display = "none";
}

//Disable the calculate button after user gets results
function disableCalc() {
  calcBtn.disabled = true;
  calcBtn.style.cursor = "default";
}

//Displays an error message if the user input does not match the rules set in the calculation.
function showError(error) {
  resultsArea.style.display = "none";
  checkErrors = true;
  disableCalc();
  calcListener();
  //create div element 
  const errorDiv = document.createElement("div");
  errorDiv.style.backgroundColor = "gray";
  errorDiv.style.color = "#fff";
  errorDiv.className = "error alert";
  errorDiv.style.marginBottom = "10px";
  errorDiv.style.minHeight = "30px";
  //create paragraph
  const p = document.createElement("p");
  p.style.textAlign = "center";
  p.innerText = error;
  p.style.paddingTop = "6px";
  //add the paragraph to the div element above
  errorDiv.appendChild(p);
  formArea.insertBefore(errorDiv, form);
  setTimeout(() => {
    //Remove the above added div element from the DOM
    document.querySelector(".alert").remove();
  }, 10000);
}
 