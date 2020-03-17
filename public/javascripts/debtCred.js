const dollarAmount = document.querySelector('#dollarAmount');

const description = document.querySelector('#description');

const debtOrCred = document.querySelector('#debtOrCred');

const acctChoice = document.querySelector('#acctChoice');

const submitAction = document.querySelector('#submitAction');

const docVal = () => {
    if(debtOrCred.value === '1'){
        return 'Deposit';
    } else {
        return 'Withdrawal';
    }
}

const acctVal = () => {
    if(acctChoice.value === '1'){
        return 'checking';
    } else {
        return 'savings';
    }
}

const calcBalAfterAction = () => {
    const adjDolAmt = Math.round(dollarAmount.value * 100) / 100;
    if (debtOrCred.value === '2' && acctChoice.value === '1'){
        dataObj.checkingBalance = Number(dataObj.checkingBalance) - Number(adjDolAmt);
    } else if (debtOrCred.value === '2' && acctChoice.value === '2'){
        dataObj.savingsBalance = Number(dataObj.savingsBalance) - Number(adjDolAmt);
    } else if (debtOrCred.value === '1' && acctChoice.value === '1'){
        dataObj.checkingBalance = Number(dataObj.checkingBalance) + Number(adjDolAmt);
    } else if (debtOrCred.value === '1' && acctChoice.value === '2'){
        dataObj.savingsBalance = Number(dataObj.savingsBalance) + Number(adjDolAmt);
    }
}

document.querySelector('#submitAction').addEventListener('click', function(){
    if (checkForNumbers(dollarAmount.value) || !dollarAmount){
        alert('Please enter dollar amount as a number.\nExample: 1.00');
        dollarAmount.value = '';
    } else {
        const adjDolAmt = Math.round(dollarAmount.value * 100) / 100;
        if (dollarAmount && debtOrCred.value === '2'){
            if (acctChoice.value === '1'){
                dataObj.cActDate.push(today());
                dataObj.cActDesc.push(`${docVal()}. ${description.value}.`);
                dataObj.cActAmt.push(`-${adjDolAmt}`);
            } else if (acctChoice.value === '2'){
                dataObj.sActDate.push(today());
                dataObj.sActDesc.push(`${docVal()}. ${description.value}.`);
                dataObj.sActAmt.push(`-${adjDolAmt}`);
            }
        }
        if(dollarAmount && debtOrCred.value === '1'){
            if (acctChoice.value === '1'){
                dataObj.cActDate.push(today());
                dataObj.cActDesc.push(`${docVal()}. ${description.value}.`);
                dataObj.cActAmt.push(`${adjDolAmt}`);
            } else if (acctChoice.value === '2'){
                dataObj.sActDate.push(today());
                dataObj.sActDesc.push(`${docVal()}. ${description.value}.`);
                dataObj.sActAmt.push(`${adjDolAmt}`);
            }
        }
    }
    calcBalAfterAction();
    dollarAmount.value = '';
    description.value = '';
    updateData();
    location.reload();
})