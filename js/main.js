let startIndex = 18;
let endIndex = 25;//370658;   //approx 

let siteURL = "https://api.evemarketer.com/ec/marketstat?typeid=";
let realURL = "https://evemarketer.com/types/";
let nameAPI = "https://www.fuzzwork.co.uk/api/typeid.php?typeid=";

async function beginLoad()
{
    $("#load-button").prop('disabled', true);
    
    $("#elementTable tbody").empty();
    let v;
    startIndex = $("#start").val();
    endIndex = $("#end").val();
    for(var i = startIndex; i < endIndex; i++)
    {
        $("#data-unloaded").html(`Loading: ${i+1-startIndex} out of ${endIndex-startIndex}`);

        v = createItemFromURL(siteURL + i);
        //console.log(v.markup > 5 ? `true ${v.markup} ${i}` : `false ${v.markup} ${i}`);
        if(!(v.markup > 5))
        {
            continue;
        }
        $("#elementTable tbody").append(generateTableRow(v));
    }
    $("#data-unloaded").html(`Done!`);
    if ($("#csvcheck").prop('checked')) 
    {
        exportTableToCSV("result.csv");
    }
    $("#load-button").prop('disabled', false);
    
}

function generateTableRow(t)
{
    let s = "";
    s += "<tr>";
    s += "<td>" + t.name + ` (${t.type})` + "</td>";
    s += "<td>" + t.buy + "</td>";
    s += "<td>" + t.sell + "</td>";
    s += "<td>" + t.markup + "</td>";
    s += "<td><a href=\"" + realURL + t.type + "\" target=\"_blank\">Link</td>";
    s +="</tr>";
    return s;
}

function getXML(theUrl)
{
    let xmlhttp;
    
    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    } else { // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange=function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200) {
            return xmlhttp.responseXML;
        }
    }
    xmlhttp.open("GET", theUrl, false);
    xmlhttp.send();
    
    return xmlhttp.response;   
}

function createItemFromURL(url)
{
    var xml = getXML(url);
    

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xml, "text/xml");

    var id = xmlDoc.getElementsByTagName("type")[0].getAttribute("id");
    var buy = xmlDoc.getElementsByTagName("buy")[0].childNodes[4].firstChild.nodeValue;
    var sell = xmlDoc.getElementsByTagName("sell")[0].childNodes[4].firstChild.nodeValue;
    var markup = Math.floor(buy - sell - (sell / 100 * 5));

    var name = getXML(nameAPI + id).split("\"typeName\": \"")[1].split("\"}").slice(0, -1);

    return new Item(id, buy, sell, markup, name);

}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/csv"});
    // Download link
    downloadLink = document.createElement("a");
    // File name
    downloadLink.download = filename;
    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);
    // Hide download link
    downloadLink.style.display = "none";
    // Add the link to DOM
    document.body.appendChild(downloadLink);
    // Click download link
    downloadLink.click();
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
        csv.push(row.join(","));
    }
    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

