var Organizations = [{ 'Name': 'A Company', 'Address': '0xE6b76C767fa9A68A4130A9ca72EF3526F9d28AB4', 'orgtype' : 2}];

var userDocuments = [{ 'Name': 'Piyush', 'Address': '0xCB52b2670738BaC0FE95443108666aB555d58bee', 'DocHashes': 'QmbEdQaz9ZfXk8p6vC8EW7z45gv1CyvpXzM3YdX2upWVa3,QmbpQ1WwYxqHf1fJ6SX9Cn8GrtDjndEmLmkxN15xSekHe2,QmVRrWFd8FaG63ZLRqLTMqTDZLu3uE3CJKX3H4zttLRSSw,QmUJeJ1PuTCHnCQcPutHRRw8yviA32WMP6LoUjApfz28Sv,QmdaoAfLUPymo5PHR7ZTMnSrtW1U4EcTXb2DH4yykUQvqV,Qmc7SZEshRcdYK9EwKYKqTFFa35GY6bjrQ71UbLmisnWaR'}];                    

localStorage.setItem('Organizations', JSON.stringify(Organizations));
localStorage.setItem('userDocuments', JSON.stringify(userDocuments));




//Check KYC Status
$('#btnCheckStatus').click( function() {
    $("#lblResult").html("") ;
    contract.checkBgvStatus($("#ddSelectEmp option:selected").val(),(req,res)=>{
        if(res==0)
            $("#lblResult").html('Alert! Your BGV Request does not exist.');
        else if(res==1)
            $("#lblResult").html('BGV Status is <strong>Pending</strong>.');
        else if(res==2)
        $("#lblResult").html('Congrats! BGV Status is <strong>Approved</strong>.');
        else if(res==3)
            $("#lblResult").html('BGV Status is <strong>Rejected</strong>.');
        else 
            $("#lblResult").html('BGV Status is ' + res);
    })
});

//GetCustomerDetails
$('#btnGetDetails').click( function() {
    $("#lblResult").html("") ;
    contract.getUserBasicDetails($("#ddSelectEmp option:selected").val(),(req,res)=>{
        console.log(res);

        if(res != null)
        {
            var op = "<strong>Name :</strong> " + res[0] + "<br />";
            if(res[1]==0)
                op +=  "<strong>Status :</strong> Not Exist <br />";
            else if(res[1]==1)
                op +=  "<strong>Status :</strong> Pending <br />";
            else if(res[1]==2)
                op +=  "<strong>Status :</strong> Verified <br />";
            else 
                op +=  "<strong>Status :</strong> Rejected <br />";
            
            op +=  "<strong>Permanent Address :</strong> " + res[2] + "<br />";
            op +=  "<strong>Current Address :</strong> " + res[3] + "<br />";
            op +=  "<strong>Email :</strong> " + res[4] + "<br />";
            op +=  "<strong>Phone :</strong> " + res[5] + "<br />";         
            op +=  "<strong>reference Email :</strong> " + res[6] + "<br />";
            $("#lblResult").html(op) ;
        }
        else
        {
            $("#lblResult").html("You are not authorized to view customer details.");
        }
    })

    //Load Documents
    $("#dvLoadCustEduDocs").html("");
    $("#dvLoadCustEmpDocs").html("");
    $("#dvLoadCustPerDocs").html("");
    var retrievedUsers = JSON.parse(localStorage.getItem('userDocuments'));
    jQuery.each(retrievedUsers, function(index, item) {
        console.log(item);
        if(item.Address == $("#ddSelectEmp option:selected").val())
        {
            var docArr = item.DocHashes.split(',');
            jQuery.each(docArr, function(ind, doc) {
                console.log(contract);
                console.log(doc);
                    contract.getUserDocument($("#ddSelectEmp option:selected").val(),doc,(req,res)=>{
                        if(res && res[2] != 0)
                        {
                            $("#dvShowDetails").css("display","inline");
                            if(res[2]==1 && localStorage["LoggedInUserType"] == 2)
                            {
                                var op = "<div class='row'><div class='col-md-8'>";
                                op += "<a href='https://ipfs.io/ipfs/" + doc + "'"+ " target='_blank'>" +  res[0] + "</a></div>";
                                op += "<div class='col-md-2'><button class='btnGet' onclick='verifyDocument(this)' id='ver_" + doc + "'>Verify</button></div>";
                                op += "<div class='col-md-2'><button class='btnPost' onclick='rejectDocument(this)' id='rej_" + doc + "'>Reject</button></div>";
                                op += "</div><hr />";
                            }
                            else if(res[2]==1 && localStorage["LoggedInUserType"] == 1)
                            {
                                var op = "<div class='row'><div class='col-md-8'>";
                                op += "<a href='https://ipfs.io/ipfs/" + doc + "'"+ " target='_blank'>" +  res[0] + "</a></div>";
                                //op += "<div class='col-md-2'><button class='btnGet' onclick='verifyDocument(this)' id='ver_" + doc + "'>Verify</button></div>";
                                //op += "<div class='col-md-2'><button class='btnPost' onclick='rejectDocument(this)' id='rej_" + doc + "'>Reject</button></div>";
                                op += "</div><hr />";
                            }
                            else if(res[2]==2)
                            {
                                var op = "<div class='row'><div class='col-md-10'>";
                                op += "<a href='https://ipfs.io/ipfs/" + doc + "'"+ " target='_blank'>" +  res[0] + "</a>";
                                op += "</div><div class='col-md-2'>";
                                op += "<img src='assets/img/verified.png' alt='Verified Document' />";
                                op += "</div></div><hr />";
                            }

                            
                            if(res[1] == 0)
                            {
                               
                            }
                            else if (res[1] == 1)
                            {
                                $("#dvLoadCustEduDocs").append(op);
                            }
                            else if(res[1] == 2)
                            {
                                $("#dvLoadCustEmpDocs").append(op);
                            }
                            else
                            {
                                $("#dvLoadCustPerDocs").append(op);
                            }

                        }
                    })
            });
        }
  });
});

function verifyDocument(e)
{
    var dochash  = e.id.substring(4);
    contract.verifyDocument($("#ddSelectEmp option:selected").val(),dochash,(req,res)=>{
        $("#lblResult").html("Document verified!!");
    })
      
} 

function rejectDocument(e)
{
    var dochash  = e.id.substring(4);
    contract.rejectDocument($("#ddSelectEmp option:selected").val(),dochash,(req,res)=>{
        $("#lblResult").html("Document verified!!");
    })
} 

//Verify Customer
$('#btnVerifyCust').click( function() {
    $("#lblResult").html("") ;
    contract.verifyCustomer($("#ddSelectEmp option:selected").val(),(req,res)=>{
        $("#lblResult").html("Customer verified!!");
    })
});

//Send KYC Request
$('#btnSendReq').click( function() {
    $("#lblResult").html("") ;
    contract.sendBgvRequest($("#ddSelectEmp option:selected").val(),(req,res)=>{
        $("#lblResult").html("BGV Request sent to customer. Wait for approval to view customer details.");
    })
});

//Approve KYC Request
$('#btnApproveKyc').click( function() {
    $("#lblResult1").html("") ;
    contract.approveBgvRequest($("#ddSelectEmployee option:selected").val(),$('#chkEdu').is(":checked"),$('#chkEmp').is(":checked"),$('#chkContact').is(":checked"), $('#chkRef').is(":checked"), $('#chkContact').is(":checked"), $('#chkAadhar').is(":checked"),$('#chkPan').is(":checked"),$('#chkDL').is(":checked"),(req,res)=>{
        $("#lblResult1").html("BGV Request Approved with given access.");
    })
});

//Reject KYC Request
$('#btnRejectKyc').click( function() {
    $("#lblResult1").html("") ;
    console.log($("#txtCustAddress").val());
    contract.rejectBgvRequest($("#ddSelectEmployee option:selected").val(),(req,res)=>{
        $("#lblResult1").html("BGV Request Rejected.");
    })
});

//Add Org
$('#btnAddOrg').click( function() {
    $("#lblResultAddOrg").html("") ;
    contract.addNewOrg($("#txtAddOrgAddress").val(),$("#txtAddOrgName").val(),2,(req,res)=>{
        $("#lblResultAddOrg").html("Your Company Registered!!");
        localStorage["LoggedInUserType"] = 1; //Employer
        window.location.href="index.html";
    })


});

//Add Third Party Verification Org
$('#btnAddThird').click( function() {
    $("#lblResultAddOrg").html("") ;
    contract.addNewOrg($("#txtAddThirdAddress").val(),$("#txtAddThirdName").val(),6,(req,res)=>{
        $("#lblResultAddOrg").html("Your Company Registered!!");
        localStorage["LoggedInUserType"] = 2; //TPVA
        window.location.href="index.html";
    })
});

//Add Customer
$('#btnAddCust').click( function() {
    $("#lblResultAddCust").html("") ;
    contract.addNewCustomer($("#txtAddCustAddress").val(),$("#txtAddCustName").val(),$("#txtCustPerAddress").val(),$("#txtCustCurAddress").val(),$("#txtCustEmail").val(),$("#txtCustPhone").val(),$("#txtCustRefEmail").val(),(req,res)=>{
        $("#lblResultAddCust").html("You are registered. Time to add your documents.");
        localStorage["LoggedInUserType"] = 0; //Users or Employees
        window.location.href="index.html";
    })
});

function loadCustomerData()
{

    contract.getMyBasicDetails((req,res)=>{
        if(res != null)
        {
            $("#txtUpdateCustName").val(res[0]);
            $("#txtUpdatePerAddress").val(res[2]);
            $("#txtUpdateCurAddress").val(res[3]);
            $("#txtUpdateCustEmail").val(res[4]);
            $("#txtUpdateCustPhone").val(res[5]);
            $("#txtUpdateCustRefEmail").val(res[6]);
        }
    })

    //LoadMyDocuments
    $("#dvLoadMyEduDocs").html("");
    $("#dvLoadMyEmpDocs").html("");
    $("#dvLoadMyPerDocs").html("");
    var retrievedUsers = JSON.parse(localStorage.getItem('userDocuments'));
    jQuery.each(retrievedUsers, function(index, item) {
        console.log(item);
        if(item.Name == localStorage.getItem('LoggedInUserName'))
        {
            var docArr = item.DocHashes.split(',');
            jQuery.each(docArr, function(ind, doc) {
                console.log(contract);
                console.log(doc);
                    contract.getMyDocument(doc,(req,res)=>{
                        if(res && res[2] != 0)
                        {
                            var op = "<div class='row'><div class='col-md-10'>";
                            op += "<a href='https://ipfs.io/ipfs/" + doc + "'"+ " target='_blank'>" +  res[0] + "</a>";
                            op += "</div><div class='col-md-2'>";
                            if(res[2]==2)
                                op += "<img src='assets/img/verified.png' alt='Verified Document' />";
                            op += "</div></div><hr />";
                            
                            if(res[1] == 0)
                            {
                               
                            }
                            else if (res[1] == 1)
                            {
                                $("#dvLoadMyEduDocs").append(op);
                            }
                            else if(res[1] == 2)
                            {
                                $("#dvLoadMyEmpDocs").append(op);
                            }
                            else
                            {
                                $("#dvLoadMyPerDocs").append(op);
                            }

                        }
                    })
            });
        }
  });
}

//Customer : Get My Basic Details
$('#mnuProfile').click( function() {    
    loadCustomerData();
});

//Customer : Update My Details
$('#btnUpdateCust').click( function() {
    $("#lblResultUpdateProfile").html("") ;
    contract.updateCustomer($("#txtUpdateCustName").val(),$("#txtUpdatePerAddress").val(),$("#txtUpdateCurAddress").val(),$("#txtUpdateCustPhone").val(),$("#txtUpdateCustRefEmail").val(),(req,res)=>{
        $("#lblResultUpdateProfile").html("Details Updated");
    })
});

//Customer Initiate Verification Request
$('#btnInitiateVerification').click( function() {
    $("#lblResultAddDoc").html("") ;
    contract.InitiateVerificationRequest("0xD2a20C57EC25a96304c74B7bC17e8d499306935f",(req,res)=>{
        $("#lblResultAddDoc").html("Verification Request Initiated with the selected organization.");
    })
});

//Sign Out
$('#mnuSignOut').click( function() {
    window.location.href="login.html";
});



$(document).ready(function() {

    //Load Role Based Screen
    if( localStorage["LoggedInUserType"] == 0)
    {
        $("#mnuOrg").css("display","none");
        $("#mnuCust").css("display","block");
        $("#mnuProfile").css("display","block");
        $("#org").css("display","none");
        $("#customer").css("display","block");
        $("#custProfile").css("display","block");  
    }
    else if( localStorage["LoggedInUserType"] == 1)
    {
        $("#mnuOrg").css("display","block");
        $("#mnuCust").css("display","none");
        $("#mnuProfile").css("display","none");
        $("#org").css("display","block");
        $("#customer").css("display","none");
        $("#custProfile").css("display","none"); 

        $("#btnVerifyCust").css("display","none"); 
        $("#btnSendReq").css("display","block"); 
        $("#btnCheckStatus").css("display","block"); 
    }
    else if( localStorage["LoggedInUserType"] == 2)
    {
        $("#mnuOrg").css("display","block");
        $("#mnuCust").css("display","none");
        $("#mnuProfile").css("display","none");
        $("#org").css("display","block");
        $("#customer").css("display","none");
        $("#custProfile").css("display","none"); 

        $("#btnVerifyCust").css("display","block"); 
        $("#btnSendReq").css("display","none"); 
        $("#btnCheckStatus").css("display","none"); 
    }
    
    //Load Organizations drop down
    var retrievedOrg = JSON.parse(localStorage.getItem('Organizations'));
    
    jQuery.each(retrievedOrg, function(index, item) {
        if(item.orgtype == 2)
        {
            var opt = "<option value='" + item.Address + "'>" + item.Name + "</option>";
            $("#ddSelectEmployee").append(opt);
        }
    });

    //Load Emp drop down
    var retrievedOrg = JSON.parse(localStorage.getItem('userDocuments'));
    
    jQuery.each(retrievedOrg, function(index, item) {
       
            var opt = "<option value='" + item.Address + "'>" + item.Name + "</option>";
            $("#ddSelectEmp").append(opt);
       
    });

    //UploadDocuments
    $('#uploadDocument').submit(function() {
        console.log("1 - Submitted");
        $("#lblResultAddDoc").empty().text("Document is uploading...");
        $(this).ajaxSubmit({
            error: function(xhr) {
                 $("#lblResultAddDoc").empty().text('Error: ' + xhr.status);
            },
            success: function(response) {
             $("#lblResultAddDoc").empty().text("Document Uploaded.");
                console.log(response);
                console.log(response[0].hash);
                contract.addDocument($("#txtAddDocName").val(),"0xD2a20C57EC25a96304c74B7bC17e8d499306935f",$("#ddAddDocType option:selected").val(),response[0].hash,(req,res)=>{
                 $("#lblResultAddDoc").empty().text("Document Uploaded.");
             })
                 
            }
    });
        //Very important line, it disable the page refresh.
    return false;
    });  

    
});
