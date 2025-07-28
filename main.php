<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $ime = $_POST["ime"];
    $prezime = $_POST["prezime"];
    $email = $_POST["email"];
    $telefon = $_POST["telefon"];
    $usluga = $_POST["usluga"];
    $poruka = $_POST["poruka"];

    $to = "kodeblackinfo@gmail.com";
    $subject = "Nova poruka s kontakt forme";
    $body = "Ime: $ime\nPrezime: $prezime\nEmail: $email\nTelefon: $telefon\nUsluga: $usluga\nPoruka:\n$poruka";

    // Piši u log
    $log_putanja = __DIR__ . "/log.txt";
    error_log("Form received:\n$body\n\n", 3, $log_putanja);

    // Pokušaj poslati mail (lokalno vjerojatno neće raditi)
    if (mail($to, $subject, $body, "From: $email")) {
        echo "✔️ Poruka je uspješno poslana!";
    } else {
        echo "❌ Greška prilikom slanja poruke.";
    }
}
?>
