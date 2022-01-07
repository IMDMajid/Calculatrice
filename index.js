/**********************************************DECLARATION********************************************************/

let digitNumberClass = document.getElementsByClassName('number');
let digitOperatorClass = document.getElementsByClassName('operator');
let previousResult = document.getElementById('previous');
let dot = document.getElementById('dot');
let equal = document.getElementById('equal');
let power = document.getElementById('ON/OFF');
let deleteChar = document.getElementById('delete');
let operationBox = document.getElementById('operation');
let resultBox = document.getElementById('result');
let wholeScreen = document.getElementById('screen');
let MAX_WIDTH = 23;
let state = 'ON';
let previousAnswer = [];

/**************************************************ANIMATION******************************************************/

/// @brief Fonction qui simule l'appui d'un bouton
/// @param DOM_Element  Element appuyé
function playAnimation(DOM_Element)
{
    let delayMilliseconds = 150;

    DOM_Element.parentElement.style.borderBottomWidth = "2px";
    DOM_Element.parentElement.style.borderLeftWidth = "2px";

    setTimeout(function(){
        DOM_Element.parentElement.style.borderBottomWidth = "4px";
        DOM_Element.parentElement.style.borderLeftWidth = "3px";
    }, delayMilliseconds);
}

/*************************************************UTILITAIRES***************************************************/

/// @brief Fonction qui annule la dernière entrée
function deleteLastEntry()
{
    let lastIndex = operationBox.innerHTML.length - 1;
    let lastChar = operationBox.innerHTML[lastIndex];

    if (lastChar === 'S')  
    {
        operationBox.innerHTML = operationBox.innerHTML.replace('ANS', '');
        return;
    }

    //Remove last char
    operationBox.innerHTML = operationBox.innerHTML.substring(0, lastIndex);

}

/// @brief Fonction qui affiche le résultat de l'operation en verifiant la validité du résultat
/// @param resultOfOperation  Résultat obtenu par la fonction eval
/// @param isValid            Paramètre indiquant une erreur de syntaxe
function printResult(resultOfOperation, isValid)
{

    if (isValid && isFinite(resultOfOperation)) 
    {
        previousAnswer.push(resultOfOperation);
        resultBox.innerHTML = resultOfOperation;
        return;
    }

    resultBox.innerHTML = 'SYNTAX ERROR';
}

/*************************************************LOGIQUE********************************************************/

/// @brief Fonction qui ajoute à l'ecran les chiffres tapés entre 0 et 9.
/// @param DOM_Element  Noeud contenant le chiffre tapé
function printOperands(DOM_Element) 
{
    if(state === 'OFF')
    {
        return;
    }

    if(operationBox.innerHTML.length >= MAX_WIDTH)
    {
        window.alert('Depassement de caractère');
        return;
    }

    playAnimation(DOM_Element);

    operationBox.innerHTML = operationBox.innerHTML + DOM_Element.innerHTML;
}

/// @brief Fonction qui ajoute les opérateurs tapés
/// @param DOM_Element  Noeud contenant l'opérateur tapé
function printOperators(DOM_Element)
{
    // Si la calculatrice est éteinte on quitte la fonction
    if(state === 'OFF')
    {
        return;
    }

    if(operationBox.innerHTML.length >= MAX_WIDTH)
    {
        window.alert('Depassement de caractère');
        return;
    }

    playAnimation(DOM_Element);

    // Si la dernière entrée est un opérateur on remplace ce dernier par la nouvelle entrée
    let lastIndex = operationBox.innerHTML.length - 1;
    if(operationBox.innerHTML.charAt(lastIndex) === '+' 
    || operationBox.innerHTML.charAt(lastIndex) === '-'  
    || operationBox.innerHTML.charAt(lastIndex) === '*' 
    || operationBox.innerHTML.charAt(lastIndex) === '^' 
    || operationBox.innerHTML.charAt(lastIndex) === '/')
    {
        deleteLastEntry();
    }

    // Si le dernier calcul a produit un resultat valide on ajoute l'opérateur à la suite de ce resultat
    if (result.innerHTML.length > 0 && resultBox.innerHTML != 'SYNTAX ERROR') 
    {
        operationBox.innerHTML = 'ANS' + DOM_Element.innerHTML;
        return;
    }

    operationBox.innerHTML = operationBox.innerHTML + DOM_Element.innerHTML;
}

/// @brief Fonction qui effectue l'operation entrée et verifie la validité
function performOperation()
{
    if(operationBox.innerHTML.length === 0)
    {
        return;
    }

    playAnimation(equal);

    let correctExpression = "";
    let lastIndex = previousAnswer.length - 1;
    let result = 0; 
    let isValidExpression = true;

    correctExpression = operationBox.innerHTML.replaceAll('^', '**');
    correctExpression = correctExpression.replaceAll('ANS', previousAnswer[lastIndex]);
    
    try 
    {
        result = eval(correctExpression);
    } 
    catch(err)
    {
        if(err instanceof SyntaxError)
        {
            isValidExpression = false;
        }
    }
    
    printResult(result, isValidExpression);
}

/// @brief Fonction qui supprime la dernière entrée
function deletePrintable()
{
    if(state === 'OFF')
    {
        return;
    }

    playAnimation(deleteChar);

    if(operationBox.innerHTML.length > 0)
    {
        deleteLastEntry();
    }
    
    if (operationBox.innerHTML.length === 0) 
    {
        resultBox.innerHTML = "";
    }
}

/// @brief Fonction qui allume et eteint la calculatrice
function turnONOFF()
{
    playAnimation(power);

    operationBox.innerHTML = "";
    resultBox.innerHTML = "";
    previousAnswer = [];

    if (state === 'ON') 
    {
        wholeScreen.style.backgroundColor = "rgb(83, 104, 85)";
        state = 'OFF';
    }
    else
    {
        wholeScreen.style.backgroundColor = "rgb(128,156,128)";   
        state = 'ON';
    }
}


/// @brief Fonction qui affiche le resultat du dernier calcul
function printPrevious()
{
    let lastIndex = operation.innerHTML.length - 1;

    if (previousAnswer.length <= 0 || operationBox.innerHTML[lastIndex] === 'S') 
    {
        return;
    }

    playAnimation(previousResult);
    
    if(operationBox.innerHTML[lastIndex] >= 0 && operationBox.innerHTML[lastIndex] <= 9)
    {
        operationBox.innerHTML = "ANS";
        return;
    }

    operationBox.innerHTML += "ANS";
}


/*********************************************ECOUTEURS D'ÉVENEMENTS***********************************************/

for (let index = 0; index < digitNumberClass.length; index++) 
{
    digitNumberClass[index].addEventListener('click', function() {
    printOperands(digitNumberClass[index]);
    }, false);
}

for (let index = 0; index < digitOperatorClass.length; index++) 
{
    digitOperatorClass[index].addEventListener('click', function() {
    printOperators(digitOperatorClass[index]);
    }, false);
}

power.addEventListener('click', turnONOFF, false);

equal.addEventListener('click', performOperation, false);

deleteChar.addEventListener('click', deletePrintable, false);

previousResult.addEventListener('click', printPrevious, false);