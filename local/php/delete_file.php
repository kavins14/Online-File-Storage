<?php
  require_once "helper.php";
  //directory is relative to this file
  $file_path = '../'.$_POST['file_path'];
  $return_text = 0;

  if(delete($file_path)){ //if function successfully executed
    echo $return_text = 1;
  }else{
    echo $return_text = "Cannot delete the file";
  }

  function delete($path){

    if(is_dir($path) == true){
      $files = array_diff(scandir($path), array('.','..')); //removes '.' and '..' directories from Array

      foreach($files as $file){
          delete(realpath($path).'/'.$file); //realpath() removes all the unneccesary '.','..','/','\'
      }

      return rmdir($path);

    }else if(is_file($path) == true && file_exists($path)){

      return unlink($path);

    }

    return false;

  }

  /*
  // Check file exist or not
  if(file_exists($file_path)){
    // Remove file
    unlink($file_path);
    // Set status
    $return_text = 1;
  }else{

    // Set status
    $return_text = "file does not exist";
  }

  // Return status
  echo $return_text;

  */
