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
    }    
  } else {
    $('#modalLogin').modal('show');  
  }
});

// Valida userKey e autoriza usuário e vice-versa
function validateUserKey() {
  uk = document.getElementById('userKey').value;
  alert(uk);

  axios.get(url + contacts, {
    headers: {
      'User-Key': uk,
    }
  })
    .then(response => {
      this.resultado = response.data;
      console.log(this.resultado);     
      sessionStorage.setItem("authorized", "true");    
      alert(sessionStorage.getItem("authorized"));
      
      storeUserKey();

    })
    .catch(error => {
      console.error(error)},      
      sessionStorage.setItem("userKey", null),   
      sessionStorage.setItem("authorized", "false"),    
      alert(sessionStorage.getItem("authorized")),
    );
}

function storeUserKey() {
  sessionStorage.setItem("userKey", uk);    
  alert(sessionStorage.getItem("userKey"));

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
      console.log(dataTableId);
      //text.split(" ")[0];
      alert(dataTableId);
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
      this.resultado = response.data;
      console.log(this.resultado);     
      // console.log(this.resultado.value[0].Name);     
      // name = this.resultado.value[0].Name;
      // alert(name);
      
      // window.onload = async function(){
      //   document.getElementById('output').innerHTML = name;
      // };
      // setTimeout(() => {  
      //   console.log("Dados encontrados, carregando na página."); 
      //   writeName(name);
      //   name = this.resultado.value[1].Name;
      //   writeName(name);

      // }, 5000);
      setTimeout(() => {  
        if (response.data != null)  {
          document.location.reload(); 
        }
      }, 1000);
    })
    .catch(error => console.error(error));
}

function createDeal() {
  var amountCurrencyReal = document.getElementById('amount').value;
  amountCurrencyReal = amountCurrencyReal.toString().replace(",", ".")
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
      this.resultado = response.data;
      console.log(this.resultado);     
      // console.log(this.resultado.value[0].Name);     
      // name = this.resultado.value[0].Name;
      // alert(name);
      
      // window.onload = async function(){
      //   document.getElementById('output').innerHTML = name;
      // };
      // setTimeout(() => {  
      //   console.log("Dados encontrados, carregando na página."); 
      //   writeName(name);
      //   name = this.resultado.value[1].Name;
      //   writeName(name);
  
      // }, 5000);
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
      this.resultado = response.data;
      console.log(this.resultado);     
      // console.log(this.resultado.value[0].Name);     
      // name = this.resultado.value[0].Name;
      // alert(name);
      
      // window.onload = async function(){
      //   document.getElementById('output').innerHTML = name;
      // };
      // setTimeout(() => {  
      //   console.log("Dados encontrados, carregando na página."); 
      //   writeName(name);
      //   name = this.resultado.value[1].Name;
      //   writeName(name);
  
      // }, 5000);
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
        this.resultado = response.data;
        console.log(this.resultado); 
    
        for (var i = 0; i < this.resultado.value.length; i++) {
          var contactTypeId;

          if(this.resultado.value[i].TypeId == 1){    
            contactTypeId = "Empresa";    
          } else {
            contactTypeId = "Pessoa";
          }
          // console.log(this.resultado.value[i].Name);
          // data[i] = this.resultado.value[i].Name;
          // console.log(data[i]);      
          tbodyContact.innerHTML += "<tr>" + 
                                    "<th scope='row'>" + this.resultado.value[i].Id + " " + 
                                    "</th>" +
                                    "<td>" + this.resultado.value[i].Name +
                                    // "<button class='btn'><i class='fas fa-edit'></i></button> " +                                    
                                    "</td>" +
                                    "<td>" + contactTypeId +                                
                                    "</td>" +
                                    "<td>" +
                                    "<button id='btnCreateDeal' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#modalDeal' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-coins'></i> Criar Negociação " +
                                    "</button> &nbsp;" +
                                    // "<button class='btn btn-primary btn-xs' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    // "<i class='fas fa-thumbtack'></i> Criar Tarefa " +
                                    // "</button> &nbsp;" +
                                    "<button id='btnInteractionRecords' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#modalInteractionRecords' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-history'></i> Registrar Histórico " +
                                    "</button>" +
                                    "</td>" +
                                    "</tr>";
        }     
        // name = this.resultado.value[0].Name;
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
                           "<th style='width: 35%;' scope='col'>Título da Negociação</th>" +
                           "<th style='width: 8%;' scope='col'>Valor</th>" +
                           "<th style='width: 7%;' scope='col'>Status</th>" +
                           "<th style='width: 40%;' scope='col'></th>" +
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
        this.resultado = response.data;
        console.log(this.resultado); 
    
        for (var i = 0; i < this.resultado.value.length; i++) {
          // console.log(this.resultado.value[i].Name);
          // data[i] = this.resultado.value[i].Name;
          // console.log(data[i]);      
          var dealStatus;

          switch(this.resultado.value[i].StatusId){
            case 1: 
              dealStatus = "Em aberto";
              break;
            case 2: 
              dealStatus = "Ganha";
              break;
            case 3: 
              dealStatus = "Perdida";
              break;              
          }

          tbodyContact.innerHTML += "<tr>" + 
                                    "<th scope='row'>" + this.resultado.value[i].Id + " " + 
                                    "</th>" +
                                    "<td>" + this.resultado.value[i].Title +
                                    // "<button class='btn'><i class='fas fa-edit'></i></button> " +                                    
                                    "</td>" +
                                    "<td>" + this.resultado.value[i].Amount +
                                    // "<button class='btn'><i class='fas fa-edit'></i></button> " +                                    
                                    "</td>" +
                                    "<td>" + dealStatus +
                                    // "<button class='btn'><i class='fas fa-edit'></i></button> " +                                    
                                    "</td>" +
                                    "<td>" +
                                    // "<button id='btnEditDeal' class='btn btn-primary btn-xs' onclick='fillDealModal()' data-toggle='modal' data-target='#modalDeal' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<button id='btnEditDeal' onclick='searchExistingDeal()' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#modalEditDeal' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-edit'></i> Editar Negociação " +
                                    "</button> &nbsp;" +
                                    "<button id='btnWinDeal' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#modalWinDeal' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-thumbs-up'></i> Ganhar Negociação " +
                                    "</button> &nbsp;" +
                                    "<button id='btnCreateTask' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#modalTask' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-thumbtack'></i> Criar Tarefa " +
                                    "</button> &nbsp;" +
                                    // "<button class='btn btn-primary btn-xs' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    // "<i class='fas fa-history'></i> Histórico " +
                                    // "</button>" +
                                    "</td>" +
                                    "</tr>"
        }     
        // name = this.resultado.value[0].Name;
      })
      .catch(error => console.error(error));
  }
}

function searchExistingDeal() {
  alert('cliquei no searchExistingDeal');
  alert(dataTableId);
  
  if (sessionStorage.getItem("authorized") == "true") {
    alert('IF no searchExistingDeal');
    // axios.get(url + deals + "?$filter=Id+eq+3004329", {})
    axios.get(url + deals, {
      headers: {
        'User-Key': sessionStorage.getItem("userKey"),
      },
    })
    .then(response => {
      this.resultado = response.data;
      console.log(this.resultado);   
      // name = this.resultado.value[0].Name;

      Object.keys(response.data).forEach(k => console.log(response.data[k]))

      alert("tituto: " + this.resultado.value[0].Title + " valor: " + this.resultado.value[0].Amount);

      // document.getElementById('dealTitle').innerHTML = this.resultado.value[0].Title;
      // document.getElementById('amount').innerHTML = this.resultado.value[0].Amount;
      
      // $('#dealTitle').val($(this).data(this.resultado.value[0].Title));
      // $('#amount').val($(this).data(this.resultado.value[0].Amount));
      
      for (var i = 0; i < this.resultado.value.length; i++) {
        if (this.resultado.value[i].Id == dataTableId){         
          editDealTitle = this.resultado.value[i].Title;
          editAmount = this.resultado.value[i].Amount;
        }
      }      

      // document.getElementById('dealTitle').innerHTML = "Titulo placeholder";
      // document.getElementById('amount').innerHTML = 10;
      // document.getElementById('modalDealLabel').innerHTML = "Editar Negócio";    
      
      $('document').ready(function () {
        $('#editDealTitle').val(editDealTitle);
        $('#editAmount').val(editAmount)
      })
      // $('#modalDeal').modal('show');
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

  // "Finished": true,
  if (sessionStorage.getItem("authorized") == "true") {
    axios.get(url + tasks, {
      headers: {
        'User-Key': sessionStorage.getItem("userKey"),
      }
    })
      .then(response => {
        this.resultado = response.data;
        console.log(this.resultado); 
    
        for (var i = 0; i < this.resultado.value.length; i++) {
          var isFinished;
          var modalType;
          var btnFinishTask;
          var btnIconFinishTask;

          if(this.resultado.value[i].Finished == true){    
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
          // console.log(this.resultado.value[i].Name);
          // data[i] = this.resultado.value[i].Name;
          // console.log(data[i]);      
          tbodyContact.innerHTML += "<tr>" + 
                                    "<th scope='row'>" + this.resultado.value[i].Id + " " + 
                                    "</th>" +
                                    "<td>" + this.resultado.value[i].Title +
                                    // "<button class='btn'><i class='fas fa-edit'></i></button> " +                                    
                                    "</td>" +
                                    "<td>" + isFinished +                              
                                    "</td>" +
                                    "<td>" +
                                    // "<button id='btnCreateDeal' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#modalDeal' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    // "<i class='fas fa-coins'></i> Criar Negociação " +
                                    // "</button> &nbsp;" +
                                    "<button id='finishTask' class='btn btn-primary btn-xs' data-toggle='modal' data-target='" + modalType + "' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    "<i class='fas fa-" + btnIconFinishTask + "'></i> " + btnFinishTask + 
                                    "</button> &nbsp;" +
                                    // "<button class='btn btn-primary btn-xs' ng-click='r.changeView('requests/edit/' + request.id)'>" +
                                    // "<i class='fas fa-history'></i> Histórico " +
                                    // "</button>" +
                                    "</td>" +
                                    "</tr>"
        }     
        // name = this.resultado.value[0].Name;
      })
      .catch(error => console.error(error));  
  }
}

function editDeal() {
  alert('here')
  var amountCurrencyReal = document.getElementById('editAmount').value;
  // alert(amountCurrencyRealEdit);
  amountCurrencyReal = amountCurrencyReal.toString().replace(",", ".")  
  // alert(amountCurrencyRealEdit);
  if (amountCurrencyReal == null || amountCurrencyReal == ""){
    amountCurrencyReal = 0;
  }

  deal = {
    "Title": document.getElementById('editDealTitle').value,
    "Amount": amountCurrencyReal,
    // "DealId": dataTableId,    
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
    // params: {
    //   'Id': dataTableId,
    // }
  })
    .then(response => {
      this.resultado = response.data;
      console.log(this.resultado);     
      // console.log(this.resultado.value[0].Name);     
      // name = this.resultado.value[0].Name;
      // alert(name);
      
      // window.onload = async function(){
      //   document.getElementById('output').innerHTML = name;
      // };
      // setTimeout(() => {  
      //   console.log("Dados encontrados, carregando na página."); 
      //   writeName(name);
      //   name = this.resultado.value[1].Name;
      //   writeName(name);
  
      // }, 5000);
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
      this.resultado = response.data;
      console.log(this.resultado);     
      // console.log(this.resultado.value[0].Name);     
      // name = this.resultado.value[0].Name;
      // alert(name);
      
      // window.onload = async function(){
      //   document.getElementById('output').innerHTML = name;
      // };
      // setTimeout(() => {  
      //   console.log("Dados encontrados, carregando na página."); 
      //   writeName(name);
      //   name = this.resultado.value[1].Name;
      //   writeName(name);
  
      // }, 5000);
      setTimeout(() => {  
        if (response.data != null)  {
          document.location.reload(); 
        }
      }, 1000);
    })
    .catch(error => console.error(error));
}

function winDeal() {
  // "FinishDate": "2020-10-25T19:26:29.86-03:00",
  deal = {
    "Id": dataTableId,
    "FinishDate": new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString(),
    "ContactId": dataTableId,
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

  axios.post(url + deals + "(" + dataTableId + ")" +  "/Win", deal, {
    headers: {
      'User-Key': sessionStorage.getItem("userKey"),
    }
  })
    .then(response => {
      this.resultado = response.data;
      console.log(this.resultado);     
      // console.log(this.resultado.value[0].Name);     
      // name = this.resultado.value[0].Name;
      // alert(name);
      
      // window.onload = async function(){
      //   document.getElementById('output').innerHTML = name;
      // };
      // setTimeout(() => {  
      //   console.log("Dados encontrados, carregando na página."); 
      //   writeName(name);
      //   name = this.resultado.value[1].Name;
      //   writeName(name);
  
      // }, 5000);
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
      this.resultado = response.data;
      console.log(this.resultado);     
      // console.log(this.resultado.value[0].Name);     
      // name = this.resultado.value[0].Name;
      // alert(name);
      
      // window.onload = async function(){
      //   document.getElementById('output').innerHTML = name;
      // };
      // setTimeout(() => {  
      //   console.log("Dados encontrados, carregando na página."); 
      //   writeName(name);
      //   name = this.resultado.value[1].Name;
      //   writeName(name);
  
      // }, 5000);
      setTimeout(() => {  
        if (response.data != null)  {
          document.location.reload(); 
        }
      }, 1000);
    })
    .catch(error => console.error(error));
}