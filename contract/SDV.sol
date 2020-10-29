pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

contract SDV{
    address public accounOwner;

	enum State { NotExist, Pending, Approved, Rejected }
	enum DocType { NotExist, Education, Employment, AadharCard, PanCard, DrivingLicense}
	enum OrgType { NotExist, Education, Employment, AadharCard, PanCard, DrivingLicense, TPVA}
	
	struct User {
		string uname;
		State state;
		string permanentAddress;
		string currentAddress;
		string email;
		string phone;
		string refEmail;
		address createdBy;
	}
	
	struct Document {
	    string name;
	    address issuedby;
	    DocType docType;
	    State state;
	}
	
	struct Organisation {
        string oname;
        OrgType otype;
        State state;
    }

    struct BGVRequest {
        State state;
        bool canViewEducation;
        bool canViewEmployer;
        bool canViewAddress;
        bool canViewReferences;
        bool canViewContactDetails;
        bool canViewAadhar;
        bool canViewPan;
        bool canViewDL;
    }

	mapping (address => User) public users;
	mapping (address => Organisation) public organisations;
	mapping (address => mapping (address => BGVRequest)) public kycRequests;
	mapping (address => mapping (string  => Document)) public documents;
	mapping (address => string) public userDocuments;
	mapping (string => Document) documentDetails;
	
	
	constructor() {
		accounOwner = msg.sender;
	}
    
    //Only Admin
    modifier onlyOwner(){
        require (accounOwner == msg.sender, "Not an Admin User!!");
        _;
    }
    
    //Check if customer is already registered
    modifier notRegisteredCustomer(address _newUser) {
		require(users[_newUser].state == State.NotExist, "Customer Already Registered!!");
		_;
    }
    
    //Check if Org is already registered
    modifier notRegisteredOrg(address _newOrg) {
		require(organisations[_newOrg].state == State.NotExist, "Org Already Registered!!");
		_;
    }
    
     //Check for a valid Org
    modifier registeredOrg(address _oAddress) {
		require(organisations[_oAddress].state != State.NotExist, "Not a valid Organization");
		_;
    }
    
    //Check for a valid Customer
    modifier registeredCustomer(address _uAddress) {
		require(users[_uAddress].state != State.NotExist, "Not a valid Customer");
		_;
    }
	
	// All: Create new Customer
	function addNewCustomer(address _userAddress, string memory _name, string memory _pAddress,string memory _cAddress, string memory _email, string memory _phone, string memory _refEmail) external notRegisteredCustomer (_userAddress)  returns (bool success) {
		users[_userAddress] = User(_name, State.Pending, _pAddress, _cAddress, _email, _phone, _refEmail, msg.sender);
		return true;
	}
	
	//Admin: Create New Org 
	function addNewOrg(address _oAddress, string memory _name, OrgType _type) external onlyOwner notRegisteredOrg(_oAddress) returns (bool success) {
		organisations[_oAddress] = Organisation(_name, _type, State.Approved);
		return true;
	}

    //Org: Verify a customer
	function verifyCustomer(address _uaddress) external registeredOrg(msg.sender) returns (bool success){
	    users[_uaddress].state = State.Approved;
	    return true;
    }
    
    //Org: Verify a document
	function verifyDocument(address _uaddress, string memory _docId) external registeredOrg(msg.sender) returns (bool success){
	    documents[_uaddress][_docId].state = State.Approved;
	    return true;
    }
    
     //Org: Reject a document
	function rejectDocument(address _uaddress, string memory _docId) external registeredOrg(msg.sender) returns (bool success){
	    documents[_uaddress][_docId].state = State.Rejected;
	    return true;
    }
    
    //Org: Send BGV Request to customer
	function sendBgvRequest(address _uAddress) external registeredOrg(msg.sender) returns (bool success) {
	    require(users[_uAddress].state == State.Approved, "Please Ask User to initiate verification request first.");
        kycRequests[_uAddress][msg.sender] = BGVRequest(State.Pending, false, false, false , false, false, false, false, false);
        //emit NewKYCRequest(_uAddress, msg.sender);
        return true;
    }
    
    //Org: Check KYC Request status for a customer
    function checkBgvStatus(address _uAddress) external view registeredOrg(msg.sender) returns (State) {
        
        return kycRequests[_uAddress][msg.sender].state;
    }
    
    // Org: Get User Details
	function getUserBasicDetails(address _userAddress) external view registeredOrg(msg.sender) returns (string memory, State, string memory, string memory, string memory, string memory, string memory) {
		
		require(kycRequests[_userAddress][msg.sender].state == State.Approved, "BGV Request is not approved by customer yet.");
		
		User memory user = users[_userAddress];
		
		if(!kycRequests[_userAddress][msg.sender].canViewAddress)
		{
		    user.permanentAddress = "";
		    user.currentAddress = "";
		}
		
		if(!kycRequests[_userAddress][msg.sender].canViewContactDetails)
		{
		    user.email = "";
		    user.phone = "";
		}
		
		if(!kycRequests[_userAddress][msg.sender].canViewReferences)
		{
		    user.refEmail = "";
		}
		
	   return (user.uname, user.state, user.permanentAddress, user.currentAddress, user.email, user.phone, user.refEmail);
	}
    
    // Org: Get a User Document
	function getUserDocument(address _userAddress, string memory docId ) external view registeredOrg(msg.sender) returns (string memory, DocType , State) {
		
		require(kycRequests[_userAddress][msg.sender].state == State.Approved, "BGV Request is not approved by customer yet.");
		
		
	        Document memory doc = documents[_userAddress][docId];

	        if(doc.docType == DocType.Education && kycRequests[_userAddress][msg.sender].canViewEducation)
    		{
    		    return (doc.name, doc.docType, doc.state);
    		}
    		else if(doc.docType == DocType.Employment && kycRequests[_userAddress][msg.sender].canViewEmployer)
    		{
    		   return (doc.name, doc.docType, doc.state);
    		}
    		else if(doc.docType == DocType.AadharCard && kycRequests[_userAddress][msg.sender].canViewAadhar)
    		{
    		   return (doc.name, doc.docType, doc.state);
    		}
    		else if(doc.docType == DocType.PanCard && kycRequests[_userAddress][msg.sender].canViewPan)
    		{
    		     return (doc.name, doc.docType, doc.state);
    		}
    		else if(doc.docType == DocType.DrivingLicense && kycRequests[_userAddress][msg.sender].canViewDL)
    		{
    		    return (doc.name, doc.docType, doc.state);
    		}
    		else
    		{
    		    return ("", DocType.NotExist, State.NotExist);
    		}
	}
	
	// Customer: Get my Document
	function getMyDocument(string memory docId ) external view registeredCustomer(msg.sender) returns (string memory, DocType , State) {
	        Document memory doc = documents[msg.sender][docId];
	       return (doc.name, doc.docType, doc.state);
	}
	
	
	function getMyBasicDetails() external view registeredCustomer(msg.sender) returns (string memory, State, string memory, string memory, string memory, string memory, string memory) {
		User memory user = users[msg.sender];
	    return (user.uname, user.state, user.permanentAddress, user.currentAddress, user.email, user.phone, user.refEmail);
	}
	
	 //Customer: Send BGV Request to customer
	function InitiateVerificationRequest(address _oAddress) external registeredCustomer(msg.sender) returns (bool success) {
    kycRequests[msg.sender][_oAddress] = BGVRequest(State.Approved, true, true, true , true, true, true, true, true);
    //emit NewKYCRequest(_uAddress, msg.sender);
    return true;
    }
	
	//Customer: update Customer
	function updateCustomer(string memory _name, string memory _pAddress,string memory _cAddress, string memory _phone, string memory _refEmail) external registeredCustomer(msg.sender) returns (bool success) {
		//require(_userAddress == msg.sender,"You can update your own details only.");
		users[msg.sender].uname = _name;
		users[msg.sender].permanentAddress = _pAddress;
		users[msg.sender].currentAddress = _cAddress;
		users[msg.sender].phone = _phone;
		users[msg.sender].refEmail = _refEmail;
		users[msg.sender].state = State.Pending;
		
		return true;
	}
    
    //User: Upload a document
	function addDocument(string memory _docName, address _IssuedBy, DocType _doctype, string memory _docHash) external registeredCustomer(msg.sender) returns (bool success){
	  // userDocuments[msg.sender] = _docHash;
	  //documentDetails[_docHash] = Document(_docName,_IssuedBy,_doctype, State.Pending);
	  documents[msg.sender][_docHash] = Document(_docName,_IssuedBy,_doctype, State.Pending);
	   return true;
    }
    
   
    
    //User: Remove a document
	function removeDocument(string memory _docHash) external registeredCustomer(msg.sender) returns (bool success){
	    //delete documentDetails[_docHash];
	    delete documents[msg.sender][_docHash];
	    return true;
    }
    
     //Customer: Approve KYC Request
    function approveBgvRequest(address _oAddress, bool _canViewEducation, bool _canViewEmployer, bool _canViewAddress, bool _canViewReferences, bool _canViewContactDetails, bool _canViewAadhar, bool _canViewPan, bool _canViewDL) external registeredCustomer(msg.sender) returns (bool success){
        require(kycRequests[msg.sender][_oAddress].state != State.NotExist, "BGV Request does not exist.");
        kycRequests[msg.sender][_oAddress].state = State.Approved;
        kycRequests[msg.sender][_oAddress].canViewEducation = _canViewEducation;
        kycRequests[msg.sender][_oAddress].canViewEmployer = _canViewEmployer;
        kycRequests[msg.sender][_oAddress].canViewAddress = _canViewAddress;
        kycRequests[msg.sender][_oAddress].canViewReferences = _canViewReferences;
        kycRequests[msg.sender][_oAddress].canViewContactDetails = _canViewContactDetails;
        kycRequests[msg.sender][_oAddress].canViewAadhar = _canViewAadhar;
        kycRequests[msg.sender][_oAddress].canViewPan = _canViewPan;
        kycRequests[msg.sender][_oAddress].canViewDL = _canViewDL;
        
        //emit KYCRequestApproved(msg.sender, _oAddress);
        return true;
    }
    
    //Customer: Reject KYC Request
    function rejectBgvRequest(address _oAddress) external registeredCustomer(msg.sender) returns (bool success){
        require(kycRequests[msg.sender][_oAddress].state != State.NotExist, "BGV Request does not exist.");
        kycRequests[msg.sender][_oAddress].state = State.Rejected;
        //emit KYCRequestApproved(msg.sender, _oAddress);
        return true;
        
    }
    
   
}
