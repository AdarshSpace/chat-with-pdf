import {FileText, Trash2, BookOpen, BrainCircuit, Clock} from "lucide-react"

 const documentCard = ({document, onDelete}) => {

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete(document);
    }

    return(
        <div>
            <h2>Document card</h2>
        </div>
    )
 }