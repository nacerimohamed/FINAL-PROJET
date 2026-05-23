<!DOCTYPE html>
<html>
<head>
    <title>Réinitialisation de mot de passe</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7fa; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .header { background-color: #10b981; color: #ffffff; text-align: center; padding: 30px 20px; }
        .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
        .content { padding: 30px; color: #333333; line-height: 1.6; }
        .otp-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; margin: 20px 0; border-radius: 8px; letter-spacing: 5px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; background-color: #f9fafb; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Réinitialisation de mot de passe</h1>
        </div>
        <div class="content">
            <p>Bonjour <strong>{{ $name }}</strong>,</p>
            <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. Voici votre code de vérification (OTP) à 6 chiffres :</p>
            
            <div class="otp-box">
                {{ $otp }}
            </div>
            
            <p>Ce code est valide pendant <strong>15 minutes</strong>. Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Plateforme Coopérative. Tous droits réservés.
        </div>
    </div>
</body>
</html>
