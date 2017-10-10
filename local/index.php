<?php
require_once "php/helper.php";

session_start();

if(isset($_SESSION['username']))
  header('Location: main.php');

$userinfo = array(
                'username'=>'password',
                );

if(isset($_POST['logout'])) {
    session_destroy();
    header('Location:  ' . $_SERVER['PHP_SELF']);
}

if(isset($_POST['username'])) {
    if(isset($userinfo[$_POST['username']]) && ($userinfo[$_POST['username']] == $_POST['password'])) {
        $_SESSION['username'] = $_POST['username'];
        header('Location: main.php');
    }else {
      $error_message = "incorrect login credentials";
    }
}
 ?>
<html>
  <head>
    <title>File Cloud</title>
      <link rel="stylesheet" type="text/css" href="styles/style.css">
  </head>
  <body>
    <div class="login_form">
        <h1>File Cloud</h1>
        <em>developed by <a href="https://github.com/kavins14">Kavin Singh</a></em><br>
        <em><a target="_blank" href="https://tutorialzine.com/2014/09/cute-file-browser-jquery-ajax-php">basic file browser</a>
        created by <a href="https://tutorialzine.com/@nick/">Nick Anastasov</a></em>
        <form name="login" action="index.php" method="post">
          <label>Username:</label> <input type="text" name="username" value="" /><br />
          <label>Password: </label> <input type="password" name="password" value="" /><br />
          <input type="submit" name="submit" value="Submit" />
        </form>
        <span class="error_message">
          <?php
            if(isset($error_message))
              echo $error_message;
          ?>
        </span>
      </div>
    </body>
</html>
