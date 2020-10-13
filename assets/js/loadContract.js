var contract = "";
if (typeof Web3 !== 'undefined') {
    console.log('inside web3')
    Web3 = new Web3(Web3.currentProvider);
} else {
    console.log('else web3');
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

window.ethereum.enable()
    .then(function (accounts) {
        console.log(accounts[0]);

        web3.eth.defaultAccount = accounts[0];

        var contractabi = web3.eth.contract([
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_docName",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "_IssuedBy",
                        "type": "address"
                    },
                    {
                        "internalType": "enum SDV.DocType",
                        "name": "_doctype",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "_docHash",
                        "type": "string"
                    }
                ],
                "name": "addDocument",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_userAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_pAddress",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_cAddress",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_email",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_phone",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_refEmail",
                        "type": "string"
                    }
                ],
                "name": "addNewCustomer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_oAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    }
                ],
                "name": "addNewOrg",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_oAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "_canViewEducation",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "_canViewEmployer",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "_canViewAddress",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "_canViewReferences",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "_canViewContactDetails",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "_canViewAadhar",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "_canViewPan",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "_canViewDL",
                        "type": "bool"
                    }
                ],
                "name": "approveBgvRequest",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_oAddress",
                        "type": "address"
                    }
                ],
                "name": "InitiateVerificationRequest",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_oAddress",
                        "type": "address"
                    }
                ],
                "name": "rejectBgvRequest",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_uaddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "_docId",
                        "type": "string"
                    }
                ],
                "name": "rejectDocument",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_docHash",
                        "type": "string"
                    }
                ],
                "name": "removeDocument",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_uAddress",
                        "type": "address"
                    }
                ],
                "name": "sendBgvRequest",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_pAddress",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_cAddress",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_phone",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_refEmail",
                        "type": "string"
                    }
                ],
                "name": "updateCustomer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_uaddress",
                        "type": "address"
                    }
                ],
                "name": "verifyCustomer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_uaddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "_docId",
                        "type": "string"
                    }
                ],
                "name": "verifyDocument",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "accounOwner",
                "outputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_uAddress",
                        "type": "address"
                    }
                ],
                "name": "checkBgvStatus",
                "outputs": [
                    {
                        "internalType": "enum SDV.State",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "name": "documents",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "issuedby",
                        "type": "address"
                    },
                    {
                        "internalType": "enum SDV.DocType",
                        "name": "docType",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum SDV.State",
                        "name": "state",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "getMyBasicDetails",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "enum SDV.State",
                        "name": "",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "docId",
                        "type": "string"
                    }
                ],
                "name": "getMyDocument",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "enum SDV.DocType",
                        "name": "",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum SDV.State",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_userAddress",
                        "type": "address"
                    }
                ],
                "name": "getUserBasicDetails",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "enum SDV.State",
                        "name": "",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "_userAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "docId",
                        "type": "string"
                    }
                ],
                "name": "getUserDocument",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    },
                    {
                        "internalType": "enum SDV.DocType",
                        "name": "",
                        "type": "uint8"
                    },
                    {
                        "internalType": "enum SDV.State",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "kycRequests",
                "outputs": [
                    {
                        "internalType": "enum SDV.State",
                        "name": "state",
                        "type": "uint8"
                    },
                    {
                        "internalType": "bool",
                        "name": "canViewEducation",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "canViewEmployer",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "canViewAddress",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "canViewReferences",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "canViewContactDetails",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "canViewAadhar",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "canViewPan",
                        "type": "bool"
                    },
                    {
                        "internalType": "bool",
                        "name": "canViewDL",
                        "type": "bool"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "organisations",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "oname",
                        "type": "string"
                    },
                    {
                        "internalType": "enum SDV.State",
                        "name": "state",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "userDocuments",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "",
                        "type": "address"
                    }
                ],
                "name": "users",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "uname",
                        "type": "string"
                    },
                    {
                        "internalType": "enum SDV.State",
                        "name": "state",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "permanentAddress",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "currentAddress",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "email",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "phone",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "refEmail",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "createdBy",
                        "type": "address"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]);
        contract = contractabi.at('0x73e4Ce4e7B36B3A5C8dC1FB65448bEb6Da4326C8');

        console.log(contract);
    });