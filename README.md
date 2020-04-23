# ODG-mask
Node plugin para mascaras de texto

# Documentation, Demo & Examples

http://odgodinho.github.io/ODG-Mask


## Install it via Package Managers
### Yarn
`yarn add @odg/odg-mask`
### NPM
`npm i @odg/odg-mask`
### Brownser
`<script src="dist/ODGMask.js">`

You can import the library or use the global element defined in window

```javascript
import ODGMask from '@odg/odg-mask'
ODGMask(
  'value', // value
  'mask', // mask
  {} // options tokens
);
```


## Div Element Mask

```javascript
/*
 * Value - value to receive masks
 * Mask - mask to apply and tokens
 *
 * ODGMask(value, mask)
 */
let div = document.querySelector('#client_cpf');
let mask = ODGMask(div.innerText, '000.000.000-00');
div.innerText = mask.value; 
div.innerText = mask.unmasked; // value without the mask
```

Examples on the DEMO website

## Input Attr Mask 

### CPF Example
```javascript
<input type="text" placeholder="000.000.000-00" odg-mask="000.000.000-00" />
```

### Date Example
```javascript
<input type="text" placeholder="00/00/0000" odg-mask="00/00/0000" />
```

### CNPJ Example
```javascript
<input type="text" placeholder="00.000.000/0000-00" odg-mask="00.000.000/0000-00" />
```

more examples in DEMO website