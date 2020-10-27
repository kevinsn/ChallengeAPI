const url = 'https://api2.ploomes.com';
const users = '/Users';
const contacts = '/Contacts';
const deals = '/Deals';
const tasks = '/Tasks';
const interactionRecords = '/InteractionRecords';    
var dataTableId;
var contactType;
var uk;

var contact = {};
var deal = {};
var task = {};

// alert(new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString());

// No load verifica se está autorizado e userKey não é nula, se sim procura contatos
$(window).on('load',function(){
  if (sessionStorage.getItem("authorized") == "true" && sessionStorage.getItem("userKey") != null) {    
    switch (sessionStorage.getItem("actualTab")){
      case "contacts":
        searchContacts();
        break;
      case "deals":
        searchDeals();
        break;
      case "tasks":
        searchTasks();
        break;
      case "interactionRecords":
        searchInteractionRecords();
        break;
    }    
  } else {
    $('#modalLogin').modal('show');  
  }
});

// Valida userKey e autoriza usuário e vice-versa
function validateUserKey() {
  uk = document.getElementById('userKey').value;
  // alert(uk);

  axios.get(url + contacts, {
    headers: {
      'User-Key': uk,
    }
  })
    .then(response => {
      
      // console.log(response.data);     
      sessionStorage.setItem("authorized", "true");    
      // alert(sessionStorage.getItem("authorized"));      
      storeUserKey();

    })
    .catch(error => {
      console.error(error)},      
      sessionStorage.setItem("userKey", null),   
      sessionStorage.setItem("authorized", "false"),    
      // alert(sessionStorage.getItem("authorized")),
    );
}

function storeUserKey() {
  sessionStorage.setItem("userKey", uk);    
  // alert(sessionStorage.getItem("userKey"));
  searchContacts();
}

// Abaixo duas funções que mudam o tipo de pessoa, física e jurídica
function activateModalNaturalPerson() {
  // alert("activateModalNaturalPerson");
  var countLegalEntity = document.getElementsByClassName("input-legal-entity");
  for (var i = 0; i < countLegalEntity.length; i++) {
    countLegalEntity[i].style.display = 'none';
  }
  
  changeContactType("Pessoa"); 
} 

function activateModalLegalEntity() {
  // alert("activateModalLegalEntity");
  var countNaturalPerson = document.getElementsByClassName("input-natural-person");
  for (var i = 0; i < countNaturalPerson.length; i++) {
    countNaturalPerson[i].style.display = 'none';
  }

  changeContactType("Empresa"); 
}

// Pega a ID do item da tabela
$(document).ready(function() {
  $(document).on("click", "#tableContact #tbodyContact tr", function() {
      dataTableId = $(this).closest('tr').text().split(" ")[0];            
      // console.log(dataTableId);
      // alert(dataTableId);
  });
});

function changeContactType(contactType) {
  document.getElementById('modalContactLabel').innerHTML = contactType;
  this.contactType = (contactType == "Pessoa") ? 2 : 1;
}

function createContact() {
  contact = {
    "TypeId": contactType,
    "Name": document.getElementById('name').value,
    "LegalName": document.getElementById('legalName').value,
    "Phones": [
      {
        "PhoneNumber": document.getElementById('phone').value,
        "TypeId": 0,
        "CountryId": 0
      }
    ],
    "StreetAddress": document.getElementById('address').value,    
    "StreetAddressLine2": document.getElementById('addressLine2').value,
    "Neighborhood": document.getElementById('neighborhood').value,
    "Email": document.getElementById('email').value,
    "Website": document.getElementById('website').value,
    "Birthday": document.getElementById('birthday').value,
    "Note": document.getElementById('note').value,
    "OtherProperties": [
          {
              "FieldKey": "{fieldKey}",
              "StringValue": "texto exemplo"
          },
          {
              "FieldKey": "{fieldKey}",
              "IntegerValue": 2
          }
    ]  
  }	

  axios.post(url + contacts, contact, {
    headers: {
      'User-Key': sessionStorage.getItem("userKey"),
    }
  })
    .then(response => {
      
      // console.log(response.data);     
      setTimeout(() => {  
        if (response.data != null)  {
          document.location.reload(); 
        }
      }, 1000);
    })
    .catch(error => console.error(error));
}

function createDeal() {
  var amountCurrencyReal = document.getElementById('amount').value.replace(".", "");
  amountCurrencyReal = amountCurrencyReal.toString().replace(",", ".");
  if (amountCurrencyReal == null || amountCurrencyReal == ""){
    amountCurrencyReal = 0;
  }

  // alert(amountCurrencyReal);
  deal = {
    "Title": document.getElementById('dealTitle').value,
    "Amount": amountCurrencyReal,
    "ContactId": dataTableId,
    "StageId": 0,
    "OtherProperties": [
        {
            "FieldKey": "{fieldKey}",
            "StringValue": "texto exemplo"
        },
        {
            "FieldKey": "{fieldKey}",
            "IntegerValue": 2
        }
    ]
  }

  axios.post(url + deals, deal, {
    headers: {
      'User-Key': sessionStorage.getItem("userKey"),
    }
  })
    .then(response => {
      
      // console.log(response.data);     

      setTimeout(() => {  
        if (response.data != null)  {
          document.location.reload(); 
        }
      }, 1000);
    })
    .catch(error => console.error(error));
}

function createTask() {
  task = {
    "Title": document.getElementById('taskTitle').value,
    "Description": document.getElementById('description').value,
    "DateTime": new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString(),
    // "ContactId": 0,    
    "DealId": dataTableId,
    // "Finished": ,
    "OtherProperties": [
        {
            "FieldKey": "{fieldKey}",
            "StringValue": "texto exemplo"
        },
        {
            "FieldKey": "{fieldKey}",
            "IntegerValue": 2
        }
    ]
  }

  axios.post(url + tasks, task, {
    headers: {
      'User-Key': sessionStorage.getItem("userKey"),
    }
  })
    .then(response => {
      
      // console.log(response.data);     

      setTimeout(() => {  
        if (response.data != null)  {
          document.location.reload(); 
        }
      }, 1000);
    })
    .catch(error => console.error(error));
}

function searchContacts() {      
  sessionStorage.setItem("actualTab", "contacts"); 

  var tableContact = document.getElementById('tableContact');

  tableContact.innerHTML = "<thead class='thead-dark'>" +
                           "<tr>" +
                           "<th style='width: 10%;' scope='col'>ID</th>" +
                           "<th style='width: 45%;' scope='col'>Nome do Cliente</th>" +
                           "<th style='width: 10%;' scope='col'>Tipo de Cliente</th>" +
                           "<th style='width: 35%;' scope='col'></th>" +
                           "</tr>" +
                           "</thead>" +
                           "<tbody id='tbodyContact'>" +                           
                           "</tbody>";

  var tbodyContact = document.getElementById('tbodyContact');

  if (sessionStorage.getItem("authorized") == "true") {
    axios.get(url + contacts, {
      headers: {
        'User-Key': sessionStorage.getItem("userKey"),
      }
    })
      .then(response => {
        
        // console.log(response.data); 
    
        for (var i = 0; i < response.data.value.length; i++) {
          var contactTypeId;

          if(response.data.value[i].TypeId == 1){    
            contactTypeId = "Empresa";    
          } else {
            contactTypeId = "Pessoa";
          }
          tbodyContact.innerHTML += "<tr>" + 
                                    "<th scope='row'>" + response.data.value[i].Id + " " + 
                                    "</th>" +
                                    "<td>" + response.data.value[i].Name +                               
                                    "</td>" +
                                    "<td>" + contactTypeId +                                
                                    "</td>" +
                                    "<td>" +
                                    "<button id='btnCreateDeal' class='btn btn-primary btn-xs' style='background-color: #48458F; border-color: #2E2C5C' data-toggle='modal' data-target='#modalDeal' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-coins'></i> Criar Negociação " +
                                    "</button> &nbsp;" +
                                    "<button id='btnInteractionRecords' class='btn btn-primary btn-xs' style='background-color: #48458F; border-color: #2E2C5C' data-toggle='modal' data-target='#modalInteractionRecords' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-history'></i> Registrar Histórico " +
                                    "</button>" +
                                    "</td>" +
                                    "</tr>";
        }     
      })
      .catch(error => console.error(error));
  }
}

function searchDeals() {  
  sessionStorage.setItem("actualTab", "deals"); 

  var tableContact = document.getElementById('tableContact');

  tableContact.innerHTML = "<thead class='thead-dark'>" +
                           "<tr>" +
                           "<th style='width: 10%;' scope='col'>ID</th>" +
                           "<th style='width: 30%;' scope='col'>Título da Negociação</th>" +
                           "<th style='width: 9%;' scope='col'>Valor</th>" +
                           "<th style='width: 8%;' scope='col'>Status</th>" +
                           "<th style='width: 43%;' scope='col'></th>" +
                           "</tr>" +
                           "</thead>" +
                           "<tbody id='tbodyContact'>" +                           
                           "</tbody>";

  var tbodyContact = document.getElementById('tbodyContact');

  // "StatusId": 2,
  if (sessionStorage.getItem("authorized") == "true") {
    axios.get(url + deals, {
      headers: {
        'User-Key': sessionStorage.getItem("userKey"),
      }
    })
      .then(response => {
        
        // console.log(response.data); 
    
        for (var i = 0; i < response.data.value.length; i++) {
          var dealStatus;
          var modalType;
          var btnFinishDeal;
          var btnIconFinishDeal;

          switch(response.data.value[i].StatusId){
            case 1: 
              dealStatus = "Em aberto";
              modalType = "#modalChangeStatusDeal";
              btnFinishDeal = "Alterar Status";
              btnIconFinishDeal = "question-circle";
              break;
            case 2: 
              dealStatus = "Ganha";              
              modalType = "#modalReopenDeal";
              btnFinishDeal = "Reabrir Negociação";              
              btnIconFinishDeal = "lock-open";
              break;
            case 3: 
              dealStatus = "Perdida";              
              modalType = "#modalReopenDeal";
              btnFinishDeal = "Reabrir Negociação";
              btnIconFinishDeal = "lock-open";
              break;              
          }

          tbodyContact.innerHTML += "<tr>" + 
                                    "<th scope='row'>" + response.data.value[i].Id + " " + 
                                    "</th>" +
                                    "<td>" + response.data.value[i].Title +                                
                                    "</td>" +
                                    "<td>" + response.data.value[i].Amount.toFixed(2).replace(".",",") +                                 
                                    "</td>" +
                                    "<td>" + dealStatus +                                  
                                    "</td>" +
                                    "<td>" +
                                    "<button id='btnEditDeal' onclick='searchExistingDeal()' class='btn btn-primary btn-xs' style='background-color: #48458F; border-color: #2E2C5C' data-toggle='modal' data-target='#modalEditDeal' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-edit'></i> Editar Negociação " +
                                    "</button> &nbsp;" +
                                    "<button id='btnChangeStatusDeal' class='btn btn-primary btn-xs' style='background-color: #48458F; border-color: #2E2C5C' data-toggle='modal' data-target='"+ modalType +"' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-" + btnIconFinishDeal + "'></i> " + btnFinishDeal +
                                    "</button> &nbsp;" +
                                    "<button id='btnCreateTask' class='btn btn-primary btn-xs' style='background-color: #48458F; border-color: #2E2C5C' data-toggle='modal' data-target='#modalTask' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-thumbtack'></i> Criar Tarefa " +
                                    "</button> &nbsp;" +
                                    "</td>" +
                                    "</tr>";
        }     
      })
      .catch(error => console.error(error));
  }
}

function searchExistingDeal() {
  // alert('cliquei no searchExistingDeal');
  // alert(dataTableId);
  
  if (sessionStorage.getItem("authorized") == "true") {
    // alert('IF no searchExistingDeal');
    axios.get(url + deals, {
      headers: {
        'User-Key': sessionStorage.getItem("userKey"),
      },
    })
    .then(response => {
      
      // console.log(response.data);   

      // alert("tituto: " + response.data.value[0].Title + " valor: " + response.data.value[0].Amount);
      
      for (var i = 0; i < response.data.value.length; i++) {
        if (response.data.value[i].Id == dataTableId){         
          editDealTitle = response.data.value[i].Title;
          editAmount = response.data.value[i].Amount;
        }
      }      

      $('document').ready(function () {
        $('#editDealTitle').val(editDealTitle);
        $('#editAmount').val(editAmount.toFixed(2).toString().replace(".", ","));
      })

    })
    .catch(error => console.error(error));
  }
}

function searchTasks() {
  sessionStorage.setItem("actualTab", "tasks"); 

  var tableContact = document.getElementById('tableContact');

  tableContact.innerHTML = "<thead class='thead-dark'>" +
                           "<tr>" +
                           "<th style='width: 10%;' scope='col'>ID</th>" +
                           "<th style='width: 55%;' scope='col'>Título da Tarefa</th>" +
                           "<th style='width: 10%;' scope='col'>Finalizada?</th>" +
                           "<th style='width: 25%;' scope='col'></th>" +
                           "</tr>" +
                           "</thead>" +
                           "<tbody id='tbodyContact'>" +                           
                           "</tbody>";

  var tbodyContact = document.getElementById('tbodyContact');

  if (sessionStorage.getItem("authorized") == "true") {
    axios.get(url + tasks, {
      headers: {
        'User-Key': sessionStorage.getItem("userKey"),
      }
    })
      .then(response => {
        
        // console.log(response.data); 
    
        for (var i = 0; i < response.data.value.length; i++) {
          var isFinished;
          var modalType;
          var btnFinishTask;
          var btnIconFinishTask;

          if(response.data.value[i].Finished == true){    
            isFinished = "Sim";    
            modalType = "#modalReopenTask";
            btnFinishTask = "Reabrir Tarefa";
            btnIconFinishTask = "lock-open";
          } else {
            isFinished = "Não";
            modalType = "#modalFinishTask";
            btnFinishTask = "Finalizar Tarefa";
            btnIconFinishTask = "clipboard-check";
          }

          tbodyContact.innerHTML += "<tr>" + 
                                    "<th scope='row'>" + response.data.value[i].Id + " " + 
                                    "</th>" +
                                    "<td>" + response.data.value[i].Title +                                
                                    "</td>" +
                                    "<td>" + isFinished +                              
                                    "</td>" +
                                    "<td>" +
                                    "<button id='finishTask' class='btn btn-primary btn-xs' style='background-color: #48458F; border-color: #2E2C5C' data-toggle='modal' data-target='" + modalType + "' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-" + btnIconFinishTask + "'></i> " + btnFinishTask + 
                                    "</button> &nbsp;" +
                                    "</td>" +
                                    "</tr>";
        }     
      })
      .catch(error => console.error(error));  
  }
}

function searchInteractionRecords() {  
  sessionStorage.setItem("actualTab", "interactionRecords"); 

  var tableContact = document.getElementById('tableContact');

  tableContact.innerHTML = "<thead class='thead-dark'>" +
                           "<tr>" +
                           "<th style='width: 10%;' scope='col'>ID</th>" +
                           "<th style='width: 13%;' scope='col'>Tipo</th>" +
                           "<th style='width: 77%;' scope='col'>Conteúdo</th>" +
                           "</tr>" +
                           "</thead>" +
                           "<tbody id='tbodyContact'>" +                           
                           "</tbody>";

  var tbodyContact = document.getElementById('tbodyContact');

  if (sessionStorage.getItem("authorized") == "true") {
    axios.get(url + interactionRecords, {
      headers: {
        'User-Key': sessionStorage.getItem("userKey"),
      }
    })
      .then(response => {
        
        // console.log(response.data); 
    
        for (var i = 0; i < response.data.value.length; i++) {
          var interactionTypeId;

          switch (response.data.value[i].TypeId){    
            case 1:
              interactionTypeId = "Simples";
              break;  
            case 2:
              interactionTypeId = "Visita";
              break;  
            case 3:
              interactionTypeId = "Telefone";
              break;  
            case 4:
              interactionTypeId = "E-mail";
              break;  
            case 5:
              interactionTypeId = "Reunião";
              break;  
            case 6:
              interactionTypeId = "Conferência";
              break;  
            case 7:
              interactionTypeId = "WhatsApp";
              break;  
          }

          tbodyContact.innerHTML += "<tr>" + 
                                    "<th scope='row'>" + response.data.value[i].Id + " " + 
                                    "</th>" +
                                    "<td>" + interactionTypeId +                                
                                    "</td>" +
                                    "<td>" + response.data.value[i].Content +                               
                                    "</td>" +
                                    "</tr>";
        }     
      })
      .catch(error => console.error(error));
  }
}

function editDeal() {
  // alert('here')
  var amountCurrencyReal = document.getElementById('editAmount').value.replace(".", "");
  // alert(amountCurrencyRealEdit);
  amountCurrencyReal = amountCurrencyReal.toString().replace(",", ".");  
  // alert(amountCurrencyRealEdit);
  if (amountCurrencyReal == null || amountCurrencyReal == ""){
    amountCurrencyReal = 0;
  }

  deal = {
    "Title": document.getElementById('editDealTitle').value,
    "Amount": amountCurrencyReal,
    "OtherProperties": [
        {
            "FieldKey": "{fieldKey}",
            "StringValue": "texto exemplo"
        },
        {
            "FieldKey": "{fieldKey}",
            "IntegerValue": 2
        }
    ]
  }

  axios.patch(url + deals + "(" + dataTableId + ")", deal, {
    headers: {
      'User-Key': sessionStorage.getItem("userKey"),
    },
  })
    .then(response => {
      
      // console.log(response.data);     
      setTimeout(() => {  
        if (response.data != null)  {
          document.location.reload(); 
        }
      }, 1000);
    })
    .catch(error => console.error(error));
}

function finishTask() {
  changeTaskStatus(true)
}

function reopenTask() {
  changeTaskStatus(false)
}

function changeTaskStatus(isFinished) {
  task = {
    "Id": dataTableId,
    "Finished": isFinished,
    "OtherProperties": [
        {
            "FieldKey": "{fieldKey}",
            "StringValue": "texto exemplo"
        },
        {
            "FieldKey": "{fieldKey}",
            "IntegerValue": 2
        }
    ]
  }

  axios.post(url + tasks + "(" + dataTableId + ")" +  "/Finish", task, {
    headers: {
      'User-Key': sessionStorage.getItem("userKey"),
    }
  })
    .then(response => {
      
      // console.log(response.data);    
      setTimeout(() => {  
        if (response.data != null)  {
          document.location.reload(); 
        }
      }, 1000);
    })
    .catch(error => console.error(error));
}

function reopenDeal() {
  var urlStatus = "/Reopen";  

  changeStatusDeal(urlStatus);
}

function finishDeal() {
  var urlStatus;

  switch (document.getElementById("statusType").value){
    case "2":
      urlStatus = "/Win";
      break;
    case "3":
      urlStatus = "/Lose";
      break;
  }

  changeStatusDeal(urlStatus);
}

function changeStatusDeal(urlStatus) {  

  // alert(urlStatus);
  deal = {
    "Id": dataTableId,
    "FinishDate": new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString(),
    "OtherProperties": [
        {
            "FieldKey": "{fieldKey}",
            "StringValue": "texto exemplo"
        },
        {
            "FieldKey": "{fieldKey}",
            "IntegerValue": 2
        }
    ]
  }

  axios.post(url + deals + "(" + dataTableId + ")" +  urlStatus, deal, {
    headers: {
      'User-Key': sessionStorage.getItem("userKey"),
    }
  })
    .then(response => {
      
      // console.log(response.data);     
      setTimeout(() => {  
        if (response.data != null)  {
          document.location.reload(); 
        }
      }, 1000);
    })
    .catch(error => console.error(error));
}

function createInteractionRecords() {

  // alert(document.getElementById('interactionType').value);

  interactionRecord = {
    "ContactId": dataTableId,
    "Date": new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString(),
    "TypeId": document.getElementById('interactionType').value,
    "Content": document.getElementById('interactionRecordText').value,
  }

  axios.post(url + interactionRecords, interactionRecord, {
    headers: {
      'User-Key': sessionStorage.getItem("userKey"),
    }
  })
    .then(response => {
      
      // console.log(response.data);    
      setTimeout(() => {  
        if (response.data != null)  {
          document.location.reload(); 
        }
      }, 1000);
    })
    .catch(error => console.error(error));
}