<?php

require_once "helper.php";

$folder_path = '../'.$_POST['folder_path'];

if(mkdir($folder_path, 0777))
{
    echo 1;
    return;
}

echo 'folder creation unsuccessful';


?>
