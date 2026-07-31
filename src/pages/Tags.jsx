import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Tag from "../components/Tag";
import { patch } from "../services/api";
import { useLocation } from 'react-router-dom';
import axios from "axios";

function Tags() {
    // 1. Déclaration unique des états
    const location = useLocation();
    // On extrait le projectId envoyé via le state du Link
    const projectId = location.state?.projectId;



    //Créer un tag
    const CreateTag = async () => {
        await axios.patch('http://localhost:3000/api/tags/tagCreate' + tag.id, {
            headers: { Authorization: 'Bearer ' + token }
        });
        onUpdate();
    }


    return (
        <div>
            <div>
                <div>
                    <h2>Commentaires du projet:</h2>
                    <button className="inline-block mb-4 text-blue-600 underline" onClick={() => CreateTag()}>+ Nouvelle tâche</button>
                </div>

                {tags.map(tag => (
                    <Tag tag={tag} key={tag.id} onUpdate={() => fetchTags(pagination.page)} />
                ))}
            </div>
        </div>
    );
}

export default Tags;