const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.enviarNotificacaoReserva = functions.firestore
    .document("reservas/{reservaId}")
    .onCreate(async (snapshot, context) => {
        const novaReserva = snapshot.data();

        try {
            // 1. Vai buscar o token da vendedora que a App guardou
            const settingsDoc = await admin.firestore()
                .doc("vendedor_settings/notificacoes")
                .get();

            if (!settingsDoc.exists) {
                console.log("Nenhum token de vendedora encontrado.");
                return null;
            }

            const registrationToken = settingsDoc.data().token;

            // 2. Monta a mensagem personalizada
            const message = {
                notification: {
                    title: "🥚 Nova Reserva de Ovos!",
                    body: `${novaReserva.cliente} reservou ${novaReserva.quantidade} ovos para ${novaReserva.dataBusca}.`
                },
                token: registrationToken
            };

            // 3. Envia a notificação
            const response = await admin.messaging().send(message);
            console.log("Notificação enviada com sucesso:", response);
            return response;

        } catch (error) {
            console.error("Erro ao enviar notificação:", error);
            return null;
        }
    });