<?php

function file_name_split($str){
	//this functions splits the file name and returns the 'name' of the file and 'date added'.
	$pos = strrpos($str, '_'); //returns position of last occuring '_'
	$pos_ext = strrpos($str, '.');
	$length = $pos_ext - $pos - 1;
	$date = substr($str, $pos+1, $length); //returns string from $pos+1 (exclusing '_') to the end
	$ext = substr($str, $pos_ext);
	$name = substr($str, 0, $pos); //returns string from start to $pos'';
	$name = $name.$ext;

	$array = array('name' => $name, 'date' => $date);

	return $array;
}
	//set the error reporting
	error_reporting(E_ALL);
?>
