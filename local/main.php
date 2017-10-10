<?php
	require_once "php/helper.php";

	session_start();

	if(!isset($_SESSION['username'])){
		die("Unauthorized Access");
	}
 ?>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>File Cloud</title>
		<link rel="stylesheet" type="text/css" href="styles/style.css">
	</head>
	<body>
		<div id="header">
			<input class="search" type="text" placeholder="search here..."/>
			<form method="POST" action="index.php" id="logout">
				<input class="logout_btn" type="submit" value="Logout" name="logout"/>
			</form>
		</div>
		<div id="wrapper">
			<main>
				<div class="file_content" id="file_content">
					<div class="side_nav">
						<span id="edit" title="Edit Mode"></span>
						<span id="upload" title="Upload"></span>
						<span id="create_folder" title="Create Folder"></span>
					</div>
					<div id="info_bar" class="info_bar">
					</div>
					<div id="modal" class="modal">
							<div id="disabler"></div>
							<div class="modal_upload">
                  <form method="POST" action="php/file_upload.php" id="file_upload" enctype="multipart/form-data">
										<label>Select folder to upload to:</label>
										<select name="folder_select" id="folder_select">
										<input type="hidden" name="MAX_FILE_SIZE" value="2000000" />
										<input type="file" id="myFile" name="files[]" multiple="" onchange="getImageInfo()"/>
										<input type="submit" value="Upload" name="submit"/>
                  </form>
									<p>Current list of files to be uploaded</p>
									<ul id="infoList"> <!-- store files to currently upload -->
									</ul>
							</div>
					</div>
					<div class="window">
						<div class="file_nav">
							<div class="breadcrumbs"></div>
						</div>
						<table>
							<thead id="table_head">
									<tr id="head_row">
											<th class="t_name" id="t_name"><span class="head_name">Filename</span></th>
											<th class="t_type" id="t_type">Type</th>
											<th class="t_size" id="t_size">Size</th>
											<th class="t_date" id="t_date">Date Added</th>
									</tr>
							</thead>
							<tbody id="file_list">
								<tr id="empty">
									<td>
										<span>No Files Here</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</main>
		</div>
	</body>
	<script src="js/jquery-3.2.1.min.js"></script>
	<script src="js/js.cookie.js"></script>
	<script src="js/file-manager.js"></script>
</html>
