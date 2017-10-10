
$(function(){

	console.log = function(){}; //comment this out to allow 'console.log' to print in console.*/
	window.location.hash = '#files'; //sets initial hash (fix of a bug)

	var	header = $('#header'),
		filemanager = $('.window'),
		breadcrumbs = $('.breadcrumbs'),
		infoBar = $('#info_bar'),
		fileList = $('#file_list');

	//fetch the file data from scan.php with an AJAX request
	$.get('scan.php', function(data) {

		var response = [data],
				currentPath = '',
				breadcrumbsUrls = [];

			console.log(response);

		var folders = [],
				files = [];
		// This event listener monitors changes on the URL. We use it to
		// capture back/forward navigation in the browser.

		$(window).on('hashchange', function(){
			goto(window.location.hash);
			//console.log(currentPath);
			// We are triggering the event. This will execute
			// this function on page load, so that we show the correct folder:

		}).trigger('hashchange');

		header.find('.search').on('input', function(e){
			folders = [];
			files = [];

			var value = this.value.trim();

			console.log(value);

			if(value.length){

				filemanager.addClass('searching');
				window.location.hash = 'search=' + value.trim();

			}else{

				filemanager.removeClass('searching');

				console.log(currentPath);

				window.location.hash = encodeURIComponent(currentPath);

			}
		});

		// Clicking on folders

		fileList.on('click', 'td.t_name_folder', function(e){
			e.preventDefault(); //cancel default navigation action of a link

			var tableRowClass = $(this).parent().attr('class');

			if(tableRowClass == 'row_folder_empty'){
				//console.log("This is an empty folder");
				return; //if the folder is empty don't proceed with the function;
			}

			var nextDir = $(this).find('a.folders').attr('href');  //href attribute holds path
			//console.log(nextDir);
			if(filemanager.hasClass('searching')) {

				// Building the breadcrumbs

				breadcrumbsUrls = generateBreadcrumbs(nextDir);

				filemanager.removeClass('searching');

			}
			else {
				breadcrumbsUrls.push(nextDir);
			}

			window.location.hash = encodeURIComponent(nextDir);

			currentPath = nextDir;
		});


		// Clicking on breadcrumbs

		breadcrumbs.on('click', 'a', function(e){
			e.preventDefault();

			var index = breadcrumbs.find('a').index($(this)),
				nextDir = breadcrumbsUrls[index];

			breadcrumbsUrls.length = Number(index);

			window.location.hash = encodeURIComponent(nextDir);

		});


		// Navigates to the given hash (path)
		function goto(hash) {

			hash = decodeURIComponent(hash).slice(1).split('='); //this returns array with one element

			if (hash.length) {

				var rendered = '';

				//if hash has search in it
				if (hash[0] === 'search') {

					filemanager.addClass('searching');
					rendered = searchData(response, hash[1].toLowerCase());

					if (rendered.length) {
						console.log("rendered has length");
						currentPath = hash[0];
						render(rendered);
					}
					else {
						console.log("rendered doesn't have length");
						render(rendered);
					}

				}

				// if hash is some path

				else if (hash[0].trim().length) {

					rendered = searchByPath(hash[0]); //data is stored in 'rendered'
					//console.log(rendered);

					if (rendered.length) {

						currentPath = hash[0];
						breadcrumbsUrls = generateBreadcrumbs(hash[0]);
						render(rendered);

					}
					else {
						currentPath = hash[0];
						breadcrumbsUrls = generateBreadcrumbs(hash[0]);
						render(rendered);
					}

				}

				// if there is no hash you will go back to page 1

				else {
					currentPath = data.path;
					breadcrumbsUrls.push(data.path);
					render(searchByPath(data.path));
				}
			}

		}
		// Splits a file path and turns it into clickable breadcrumbs

		function generateBreadcrumbs(nextDir){
			var path = nextDir.split('/').slice(0);
			for(var i=1;i<path.length;i++){
				path[i] = path[i-1]+ '/' +path[i];
			}
			return path;
		}


		// Locates a file by path

		function searchByPath(dir) {
			var path = dir.split('/'),
				demo = response,
				flag = 0;

			for(var i=0;i<path.length;i++){
				for(var j=0;j<demo.length;j++){
					if(demo[j].name === path[i]){
						flag = 1;
						demo = demo[j].items;
						break;
					}
				}
			}

			demo = flag ? demo : [];
			return demo;
		}

		// Recursively search through the file tree

		function searchData(data, searchTerms) {

			data.forEach(function(d){
				if(d.type === 'folder') {

					searchData(d.items,searchTerms);

					if(d.name.toLowerCase().match(searchTerms)) {
						folders.push(d);
					}
				}
				else if(d.type === 'file') {
					if(d.name.toLowerCase().match(searchTerms)) {
						files.push(d);

					}
				}
			});
			return {folders: folders, files: files};
		}

		//file.hide(); //removes file from list
		function removeFile(data, filePath) {

			data.forEach(function(d, index, array){
				if(d.type === 'folder') {
					removeFile(d.items, filePath);

					if(d.path === filePath) {
						array.splice(index, 1);
					}
				}
				else if(d.type === 'file') {
					if(d.path === filePath) {
						array.splice(index, 1);
					}
				}
			});
		}

		var download;
		var editMode;
		var sortSelection;
		var sortOrder = new Array(3);


		// Render the HTML for the file manager
		function render(data) {
			var scannedFolders = [],
				scannedFiles = [];


			if(Array.isArray(data)) {

				console.log('data is an array');
				data.forEach(function (d) {

					if (d.type === 'folder') {
						scannedFolders.push(d);
					}
					else if (d.type === 'file') {
						scannedFiles.push(d);
					}

				});

			}
			else if(typeof data === 'object') {

				console.log("data is an object");

				scannedFolders = data.folders;
				scannedFiles = data.files;

			}


			// Empty the old result and make the new one

			fileList.empty().hide();

			if(!scannedFolders.length && !scannedFiles.length) {

					var row = document.createElement('TR');
					row.setAttribute("id", "empty");
					var data = document.createElement('TD');
					var span = document.createElement('span');
					span.innerHTML = 'No Files Here';
					data.appendChild(span);
					row.appendChild(data);
					fileList.append(row);

					setTimeout(function(){row.style.opacity = 1;},1);

			} else {

			}

			//editMode = false; change to true to allow deletion of files
			var delete_icon;

			if(scannedFolders.length) {

				console.log(scannedFolders);

				scannedFolders.forEach(function(f) {

					var tableRow = document.createElement("TR");
					tableRow.className = "row_folder";

					var name = escapeHTML(f.name),
						icon = '<span class="icon_folder"></span>',
						type = "folder",
						dateAdded = "-",
						itemsLength = f.items.length;

					delete_icon = (editMode) ? '<span class="delete"></span>' : '';


					if(itemsLength == 1) {
						itemsLength += ' item';
					}
					else if(itemsLength > 1) {
						itemsLength += ' items';
					}
					else {
						itemsLength = 'Empty';
						tableRow.className = "row_folder_empty";
					}

					var folderName = $('<td class="t_name_folder">'+delete_icon+icon+'<a href="'+ f.path +'" title="'+ f.path +'" class="folders">' + name + '</a></td>');
					var folderType = $('<td class="t_type">'+type+'</td>');
					var folderSize = $('<td class="t_size">'+itemsLength+'</td>');
					var folderDate = $('<td class="t_date">'+dateAdded+'</td>');

					folderName.appendTo(tableRow);
					folderType.appendTo(tableRow);
					folderSize.appendTo(tableRow);
					folderDate.appendTo(tableRow);
					//console.log(tableRow);
					fileList.append(tableRow);
				});

			}

			if(scannedFiles.length) {

				switch(sortSelection) {
    			case "name":
							sortOrder[0] = (sortOrder[0]) ? false : true;
        			fileSort(scannedFiles, "name", sortOrder[0]); //ascending order
        			break;
    			case "type":
							sortOrder[1] = (sortOrder[1]) ? false : true;
							fileSort(scannedFiles, "type", sortOrder[1]); //ascending order
        			break;
					case "size":
							sortOrder[2] = (sortOrder[2]) ? false : true;
							fileSort(scannedFiles, "size", sortOrder[2]); //ascending order
							break;
					case "date":
							dateSort(scannedFiles);
							break;
    			default:
        			fileSort(scannedFiles, "name", true);
					}

				//fileSort(scannedFiles, "name", true); //function(files, type, ascending);
				//fileSort(scannedFiles, "type", true);
				//fileSort(scannedFiles, "size", false)

				scannedFiles.forEach(function(f) {

					var tableRow = document.createElement("TR");

					var fileSize = bytesToSize(f.size),
						name = escapeHTML(f.name),
						fileType = name.split('.'),
						date_added = f.date_added,
						icon,
						href = ' href="'+f.path+'" ';

					download = (Cookies.get('checkBoxState') == 'true') ;

					console.log('download: ' + download);

					fileType = fileType[fileType.length-1]; //gets the last element in the array which is the extension
					icon = '<span class="icon_file_'+fileType+'">'+'</span>';
					delete_icon = (editMode) ? '<span class="delete"></span>' : '';

					if(!download)
						href = '';



					var fileName = $('<td class="t_name">'+delete_icon+icon+'<a'+ href + ' title="'+ f.path +'" class="files" download>'+ name +'</a></td>'); //href="'+f.path+'"
					var fileType = $('<td class="t_type">'+fileType+'</td>');
					var fileSize = $('<td class="t_size">'+fileSize+'</td>');
					var fileDate = $('<td class="t_date">'+date_added+'</td>');

					fileName.appendTo(tableRow);
					fileType.appendTo(tableRow);
					fileSize.appendTo(tableRow);
					fileDate.appendTo(tableRow);

					fileList.append(tableRow);
				});

			}


			// Generate the breadcrumbs

			var url = '';

			if(filemanager.hasClass('searching')){

				url = '<span>Search results: </span>';
				fileList.removeClass('animated');

			}else{

				breadcrumbsUrls.forEach(function (u, i) {

					var name = u.split('/');

					if (i !== breadcrumbsUrls.length - 1) {
						url += '<a href="'+u+'"><span class="folderName">' + name[name.length-1] + '</span></a> <span class="arrow">→</span> ';
					}
					else {
						url += '<span class="folderName">' + name[name.length-1] + '</span>';
					}

				});

			}

			breadcrumbs.text('').append(url);

			// Show the generated elements
			console.log("current path: " + currentPath);
			fileList.show();
		}



		infoBar.on('click', '#submit_folder', function(){
			var folder_name = $('#folder_text').val();
			var folder_path = currentPath;
			var error_message = $('.createfolder_error');
			var error = false;

			if(folder_name === ""){
				error_message.css('color','red');
				error_message.html('Please input a folder name');
				return;
			}

			folder_path = folder_path + '/' + folder_name;

			function addFile(data, filePath, folderName) {
				var realPath = filePath+'/'+folderName;
				var f = {name: folderName, type: "folder", path: realPath, items:[]};

				data.forEach(function(d, index, array){
					if(d.type === 'folder') {
						addFile(d.items, filePath, folderName);
						if(d.path === filePath) {
							var duplicate = array[index].items.findIndex(i => i.name.toLowerCase() === folderName.toLowerCase());
							console.log(duplicate);
							if(duplicate == -1){
								array[index].items.push(f);
								console.log(response);
							}else{
								error_message.html('duplicate folder');
								error = true;
							}
						}
					}
				});
			}

			addFile(response, currentPath, folder_name);
			if(error)
				return;

			$.ajax({
				url: 'php/create_folder.php',
				type: 'post',
				data: {folder_path: folder_path},
				success: function(response){
				//console.log(response);
					if(response == 1){
						error_message.css('color','green');
						error_message.html("Folder: \'"+folder_name+"\' has been created");
						goto(window.location.hash);
					}else{
						error_message.css('color','red');
						error_message.html(response);
						//console.log(response);
					}
				}
			});

		});

		//deletes files when 'delete' button clicked
		fileList.on('click', 'span.delete', function(e){
			e.stopPropagation();

			var quickDelete = $('#editmode_qdelete').prop('checked');
			console.log('quick: ' + quickDelete);
  		var filePath = $(this).parent().find('a').attr('title');
			var file = $(this).parent().parent();

			if(!quickDelete)
 				if(!confirm("Do you want to delete this file?")) //if cancel is clicked this function breaks
 					return;

			file.hide();
 			// AJAX request
  			$.ajax({
  				url: 'php/delete_file.php',
   				type: 'post',
   				data: {file_path: filePath},
   				success: function(resp){ //response
 					//console.log(response);
    				// Changing image source when remove
    				if(resp == 1){
    					console.log("deletion of file:"+filePath+" = SUCCESSFUL");
							removeFile(response, filePath);
    				}else{
    					console.log("deletion failed: "+filePath);
							file.show();
    				}
   				}
  			});
 			});

		// This function escapes special html characters in names

		function escapeHTML(text) {
			return text.replace(/\&/g,'&amp;').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
		}


		// Convert file sizes from bytes to human readable units

		function bytesToSize(bytes) {
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
			if (bytes == 0) return '0 Bytes';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
		}


		////////////*---------SIDE BAR JS------------*//////////////
		var tableHead = $('#table_head'),
		 		btn_folder = $('#create_folder'),
		 		btn_upload = $('#upload'),
				btn_editMode = $('#edit'),
		 		modal = $('#modal');


		btn_folder.click(function(){
				createfolder_menu();
			});

		btn_upload.click(function(){
				modal.css('display', 'block');
		});

		$('#disabler').click(function (e) {
        modal.css('display', 'none');
		});

		btn_editMode.click(function(){
				edit_menu();
		});

		infoBar.on('click','#editmode_download', function(){
			var state = $('#editmode_download').prop('checked');
			Cookies.set('checkBoxState', state.toString());
			goto(window.location.hash);
		});

		function createfolder_menu(){ //creates and displays folder creation menu

				$(this).toggleClass("active");

				if(!infoBar.hasClass("createfolder")){
					infoBar.attr('class','info_bar createfolder');
					infoBar.html('<h5>Create a folder</h5><p>created in current directory</p><p><em><b>Folder Name</b></em></p><input type="text" id="folder_text"/><input type="button" value="Create" id="submit_folder" style="margin-top: 10px;"/><p class="createfolder_error" style="color: red"></p>');

					}else{
							infoBar.removeClass('createfolder');
							infoBar.html('');
					}

				editMode = false;
				goto(window.location.hash);

		}

		function edit_menu(){

			$(this).toggleClass("active");

			if(!infoBar.hasClass("editmode")){
				infoBar.attr('class','info_bar editmode');
				infoBar.html('<h5>Edit menu</h5><input type="checkbox" id="editmode_download" name="download" value="download"><span>allow download</span></input><br><input type="checkbox" id="editmode_qdelete" name="delete" value="delete"><span>quick delete</span></input>');
				$('#editmode_download').prop('checked', (Cookies.get('checkBoxState') == 'true'));

				}else{
					infoBar.removeClass('editmode');
					infoBar.html('');
			}

			editMode = (editMode) ? false : true;
			goto(window.location.hash); //re-renders menu

		}

		uploadFolders(response, 0);

		function uploadFolders(data, level) {
			var strLevel = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";


			data.forEach(function(d){

				if(d.type === 'folder') {

					var path = d.path.substring(6); //removes files/ for safety reasons
					path = path.replace('\'', '&#39;');
					path = path.replace('\"', '&#34;')
					//console.log(path);
					var displayString = strLevel.repeat(level) + "|" + "-----" + d.name;
					$('#folder_select').append("<option value='"+path+"'>"+displayString+"</option>");

					uploadFolders(d.items, level+1);

				}

			});
		}

		/*/////////////////-----------SORTING FUNCTION-----------////////////////*/
		tableHead.on('click','#t_name', function(){
			sortSelection = "name";
			goto(window.location.hash);

		});

		tableHead.on('click','#t_type', function(){
			sortSelection = "type";
			goto(window.location.hash);
		});

		tableHead.on('click','#t_size', function(){
			sortSelection = "size";
			goto(window.location.hash);
		});

		tableHead.on('click','#t_date', function(){
			sortSelection = "date";
			goto(window.location.hash);
		});

		function dateSort(files){

			function returnYear(date){
				return parseInt(date.slice(6,10));
			}

			function returnMonth(date){
				return parseInt(date.slice(3,5));
			}

			function returnDay(date){
				return parseInt(date.slice(0,2));
			}

			//sorts the year
			for(var j = 1; j < files.length; j++){
				var tempYear = returnYear(files[j].date_added);
				var temp = files[j];
				var index = j;

				while (index > 0 && (tempYear > returnYear(files[index-1].date_added))){
						files[index] = files[index-1];
						index--;
				}
					files[index] = temp;
			}

			for(var i=0; i < files.length-1; i++){
				var index = i;
				var temp = files[i];

				//sorts month and date
				if(returnYear(files[index].date_added) == returnYear(files[index+1].date_added)){
					if(returnMonth(files[index].date_added) < returnMonth(files[index+1].date_added)){
						files[index] = files[index+1]
						files[index+1] = temp;
					}else if(returnMonth(files[index].date_added) == returnMonth(files[index+1].date_added)){
						if(returnDay(files[index].date_added) < returnDay(files[index+1].date_added)){
							files[index] = files[index+1]
							files[index+1] = temp;
						}
					}
				}
			}

		}

		function fileSort(files, type, ascending){
			files.sort(function(a,b){
				if(type === "name"){
					if(a.name > b.name) return ascending;
					if(a.name < b.name) return !ascending;
					return 0;
				}
				if(type === "type"){
					if(a.name.split('.')[1] > b.name.split('.')[1]) return ascending;
					if(a.name.split('.')[1] < b.name.split('.')[1]) return !ascending;
					return 0;
			  }
			  if(type === "size"){
					if(a.size > b.size) return ascending;
					if(a.size < b.size) return !ascending;
					return 0;
				}
			});
		}

	});
});

/*/////////////////-----------FILES LIST DISPLAY (on upload) FUNCTION-----------////////////////*/

//got from list-upload.js
function getImageInfo(){
		var x = document.getElementById("myFile");
		var list = document.getElementById("infoList");
		var uploadFile = x.files;

		//every time function is called remove all child elements
		var listNode = document.getElementById("infoList");
	while (listNode.firstChild) {
			listNode.removeChild(listNode.firstChild);
		}

		if ('files' in x) {
				if (uploadFile.length == 0) {
						console.log("No files Selected");
				} else {
						for (var i = 0; i < uploadFile.length; i++) {
								console.log(`${i+1} images selected`);
								var li = document.createElement('li');


								(function(file) {
									var reader = new FileReader();
									var thumbnail = document.createElement("img");
									thumbnail.height = "100";
									reader.onloadend = function(e) {
										thumbnail.src = reader.result;
									}
									reader.readAsDataURL(file);
									li.appendChild(thumbnail);
								})(uploadFile[i]);


								/*if (window.FileReader && uploadFile[i].type.match('image.*')) {

								} else {
									thumbnail.src = "";
								}*/
								//creating image thumbnail ^^
								//var file_extension = uploadFile[i].name.split('.').pop();
								var file_size = (uploadFile[i].size / 1000000).toFixed(3) +" MB"; //tofixed sets decimal places
								var file_name = document.createTextNode(`File ${i+1}: ${uploadFile[i].name}, File Size: ${file_size}`);
								if(uploadFile[i].size > 2000000){ li.style.color = "red"; }
								li.appendChild(file_name);
								list.appendChild(li);
				}
	}

}
}
