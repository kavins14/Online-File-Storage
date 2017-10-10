<?php
require_once "helper.php";


$upload_dir = $_POST['folder_select'];
$upload_count = 0;
$errors = array("Successful upload", "There's a file that exceeds max server size", "There's a file that exceeds form size", "Partially uploaded", "No file uploaded", ' ', "Missing temporary folder", "Failed to write on disk");
	//erros are according to PHP errors
if(strpos($upload_dir,'..') == true){
  die('invalid upload directory value');
}
$directory = '../files/'.$upload_dir.'/'; //uploads files into 'upload_folder'
if(is_dir($directory)==false){
  die('directory does not exist'); //if no directory of that sort, DIEEEEE!!!!!
}

$extensions = array("png", "jpeg","jpg","pdf","docx", "xlsx", "pptx","zip","gif", "php", "js", "html", "css", "rar"); //accepted extensions

if(isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST"){
	if(isset($_POST['submit'])){
		if(!($_FILES['files']['error'][0] == 4) ){ // 4 == no file uploaded
		   if($_FILES['files']['error'][0] == 0){
			// Loop $_FILES to exeicute all files
			foreach ($_FILES['files']['name'] as $f => $file_name) {
			 	$file_size = $_FILES['files']['size'][$f]; //size of each file
   				$file_tmp = $_FILES['files']['tmp_name'][$f]; //temporary name of each file
   				$file_type= $_FILES['files']['type'][$f]; //type of file
   				$file_ext_arr = explode('.', $file_name); //becomes an array with two elements
   				$file_ext = $file_ext_arr[1]; //returns last element in the array
   				$file_ext = ($file_ext == "jpeg") ? $file_ext = "jpg" : $file_ext = $file_ext;
   				$file_ext = strtoLower($file_ext); //decapitalizes the string
   				$file_raw_name = $file_ext_arr[0]; //returns first element in the array (the raw name);

				$real_file_name = $file_raw_name."_".date("d-m-Y",time()).'.'.$file_ext; //date added

   				if(in_array($file_ext,$extensions ) === false){ //checks with array to see if extensions are met
					$error_message ="Invalid extension detected in the file: ".$file_name." with extension: ".$file_ext;
					die($error_message);

				}
   				if($_FILES['files']['size'][$f] > 5243000){
					$error_message ='File size must be less tham 5 MB: '.$file_name;
					die($error_message);
				}else{

				}

   				move_uploaded_file($file_tmp,$directory.$real_file_name) or die('Cannot move_uploaded_file'); //moves file into the repective the directory
   				$upload_count++;

				}
			  }else{ die($errors[$_FILES['files']['error'][0]]); }
			}else{ die("No file uploaded");}

			echo "Upload Success! Upload Count: ".$upload_count;
      echo '<br><button><a href="../main.php" style="height:200px;width:200px">Go Back</a></button>';
		}
	}
?>
