var table;
var xmlTag;

function loadXMLData() {
	var oXHR = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

	function rStatus() {
		if(oXHR.readyState == 4) fnShowXMLData(this.responseXML);
	}

	oXHR.onreadystatechange = rStatus;
    //Refer XML File path from SharePoint Library
	oXHR.open("GET", "../Shared%20Documents/SampleCDCatlog.xml", true); // true = ASYNCHRONOUS, false = SYNCHRONOUS. 
	oXHR.send();

	function fnShowXMLData(xml) {
		xmlTag = xml.getElementsByTagName("CD");
		table = "<tr><th>Title</th><th>Artist</th><th>Country</th><th>Company</th><th>Price</th><th>Year</th></tr>";
		for(i = 0; i < xmlTag.length; i++) {
			table += "<tr><td>";
			table += xmlTag[i].getElementsByTagName("TITLE")[0].childNodes[0].nodeValue;
			table += "</td><td>";
			table += xmlTag[i].getElementsByTagName("ARTIST")[0].childNodes[0].nodeValue;
			table += "</td><td>";
			table += xmlTag[i].getElementsByTagName("COUNTRY")[0].childNodes[0].nodeValue;
			table += "</td><td>";
			table += xmlTag[i].getElementsByTagName("COMPANY")[0].childNodes[0].nodeValue;
			table += "</td><td>";
			table += xmlTag[i].getElementsByTagName("PRICE")[0].childNodes[0].nodeValue;
			table += "</td><td>";
			table += xmlTag[i].getElementsByTagName("YEAR")[0].childNodes[0].nodeValue;
			table += "</td></tr>";
		}
		document.getElementById("XMLTable").innerHTML = table;
	};
}

function fnUploadData() {
	for(i = 0; i < xmlTag.length; i++) {
		var title = xmlTag[i].getElementsByTagName("TITLE")[0].childNodes[0].nodeValue;
		var artist = xmlTag[i].getElementsByTagName("ARTIST")[0].childNodes[0].nodeValue;
		var country = xmlTag[i].getElementsByTagName("COUNTRY")[0].childNodes[0].nodeValue;
		var company = xmlTag[i].getElementsByTagName("COMPANY")[0].childNodes[0].nodeValue;
		var price = xmlTag[i].getElementsByTagName("PRICE")[0].childNodes[0].nodeValue;
		var year = xmlTag[i].getElementsByTagName("YEAR")[0].childNodes[0].nodeValue;
        fnUploadToList(title, artist, country, company, price, year);
	}
    alert("Data Uploaded.!!");
}

function fnUploadToList(Title, Artist, Country, Company, Price, Year){
    var requestUriPOST = _spPageContextInfo.webAbsoluteUrl + "/_api/web/lists/getbytitle('XMLDataContainer')/items?";
	$.ajax({
		url: requestUriPOST,
		type: "POST",
		data: JSON.stringify({
			__metadata: {
				type: "SP.Data.XMLDataContainerListItem"
			},
			Title: Title,
            Artist: Artist, 
            Country: Country, 
            Company: Company, 
            Price: Price, 
            Year : Year
		}),
        async: false,
		headers: {
			"Accept": "application/json;odata=verbose",
			"Content-Type": "application/json;odata=verbose",
			"X-RequestDigest": $("#__REQUESTDIGEST").val(),
			"X-HTTP-Method": "POST"
		},
		success: function(data) {
            console.log("Item Created.!");
        },
		error: function(data) {
			alert(data.responseJSON.error);
		}
	});
}