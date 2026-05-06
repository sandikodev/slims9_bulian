<?php
/**
 * @Created by          : Waris Agung Widodo (ido.alit@gmail.com)
 * @Date                : 2020-01-10 08:01
 * @File name           : index.php
 */

if (file_exists(__DIR__ . '/../config/database.php')) {
    header('Location: ' . '../index.php');
    exit();
}

session_start();
$length = 24;
$_SESSION['csrf_token'] = bin2hex(substr(str_shuffle(str_repeat($x='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', ceil($length/strlen($x)) )),1,$length));
?>
<!doctype html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="shortcut icon" href="../webicon.ico" type="image/x-icon"/>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="css/tailwind.min.css">

    <title>SLiMS Installer</title>
    <style>
        .slims-version {
            transform: rotate(-90deg);
            transform-origin: top left;
            text-align: left;
            height: 24px;
            line-height: 24px;
            width: 400px;
            position: absolute;
            left: 1.5rem;
            bottom: 0;
            color: white;
            letter-spacing: 0.5em;
            font-size: 10px;
            padding-left: 60px;
        }

        .slims-version:before {
            content: " ";
            position: absolute;
            left: 0;
            top: 12px;
            height: 1px;
            width: 50px;
            background-color: white;
        }

        .slims-version .slims-dash {
            height: 1px;
            width: 15px;
            background-color: white;
            display: inline-block;
        }

        .lds-dual-ring {
            display: inline-block;
            width: 20px;
            height: 20px;
        }

        .lds-dual-ring:after {
            content: " ";
            display: block;
            width: 17px;
            height: 17px;
            margin: 1px;
            border-radius: 50%;
            border: 2px solid #fff;
            border-color: #fff transparent #fff transparent;
            animation: lds-dual-ring 1s linear infinite;
        }

        @keyframes lds-dual-ring {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        .min-h-screen {
            min-height: 100vh;
        }
    </style>
</head>
<body class="bg-gray-800">
<div id="app" class="bg-transparent font-light"></div>
<!-- Required JavaScript -->
<script src="js/vue.min.js"></script>
<script src="js/main.js?v=<?= filemtime(__DIR__ . '/js/main.js') ?>" type="module" csrf="<?= $_SESSION['csrf_token'] ?>"></script>
</body>
</html>
