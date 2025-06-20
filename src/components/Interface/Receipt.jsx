import React, { forwardRef } from 'react';

const Receipt = forwardRef(({ commande }, ref) => {
    if (!commande) return null;

    const dateCommande = new Date(commande.date_commande).toLocaleDateString('fr-FR');
    const prixUnitaire = Number(commande.produit?.prix) || 0;
    const total = Number(commande.prix_total) || 0;

    return (
        <div
            ref={ref}
            className="font-cormorant text-[#2c3e50] bg-[#f9f9f9] p-8 max-w-2xl mx-auto rounded-xl shadow-md"
        >
            <h1 className="text-3xl font-semibold text-center text-[#3498db] mb-2">Reçu de Commande</h1>
            <p className="text-center mb-1">
                Commande N° <strong>{commande.id}</strong> — {dateCommande}
            </p>
            <p className="text-center mb-6">
                Numéro de Reçu : <strong>{commande.numero_recu ?? 'En attente'}</strong>
            </p>
            <hr className="mb-6 border-gray-300" />

            <h2 className="text-xl border-b-2 border-[#3498db] pb-1 mb-3">Client</h2>
            <div className="space-y-1 text-[15px] leading-relaxed mb-6">
                <p><strong>Nom :</strong> {commande.client_nom}</p>
                <p><strong>Téléphone :</strong> {commande.client_telephone}</p>
                {commande.livraison && <p><strong>Adresse :</strong> {commande.adresse_livraison}</p>}
                {commande.notes && <p><strong>Notes :</strong> {commande.notes}</p>}
                <p><strong>Compagnie :</strong> {commande.compagnie?.nom ?? 'N/A'}</p>
                <p><strong>Transaction :</strong> {commande.transaction?.code_transaction ?? 'N/A'}</p>
                <p><strong>Méthode de paiement :</strong> Orange Money</p>
            </div>

            <h2 className="text-xl border-b-2 border-[#3498db] pb-1 mb-3">Produit</h2>
            <table className="w-full text-left text-[15px] bg-white border border-gray-300 shadow-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border border-gray-300 px-3 py-2">Nom</th>
                        <th className="border border-gray-300 px-3 py-2">Quantité</th>
                        <th className="border border-gray-300 px-3 py-2">Prix unitaire</th>
                        <th className="border border-gray-300 px-3 py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 px-3 py-2">{commande.produit?.nom ?? 'Produit'}</td>
                        <td className="border border-gray-300 px-3 py-2">{commande.quantite}</td>
                        <td className="border border-gray-300 px-3 py-2">{prixUnitaire.toFixed(0)} FCFA</td>
                        <td className="border border-gray-300 px-3 py-2">{total.toFixed(0)} FCFA</td>
                    </tr>
                </tbody>
            </table>

            <h2 className="text-right text-xl mt-8">
                Total : <span className="text-[#e67e22]">{total.toFixed(0)} FCFA</span>
            </h2>

            <p className="text-center mt-10 text-[16px]">Merci pour votre achat !</p>
        </div>
    );
});

export default Receipt;
