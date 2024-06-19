import os
import re
import tqdm
import logging

from bs4 import BeautifulSoup, SoupStrainer
from langchain_community.document_loaders import BSHTMLLoader

from llama_index.core import Document, load_index_from_storage
from llama_index.core.node_parser import HierarchicalNodeParser, get_leaf_nodes
from llama_index.core import ServiceContext, VectorStoreIndex, StorageContext


def filter_html_files(html_files):
    pattern = re.compile(r"/v\d{1,2}.")
    pattern2 = re.compile(r"/\d{1,2}.")
    filtered_files = [file for file in html_files if not pattern.search(file) and not pattern2.search(file)]
    return filtered_files


def get_html_files(root_folder):
    html_files = []
    for root, dirs, files in os.walk(root_folder):
        for file in files:
            if file.endswith(".html"):
                html_files.append(os.path.join(root, file))
    return sorted(filter_html_files(html_files))


def create_documentation(documentation_dir="./PagoPADevPortal/out/"):

    if documentation_dir[-1] != "/":
        documentation_dir += "/"

    logging.info(f"Getting documentation from: {documentation_dir}")
    
    html_files = get_html_files(documentation_dir)
    # parse_only = SoupStrainer("div", {"id": "page-content"})

    documents = [Document(
        text=(
            "# Identità Chatbot\n\n\n\n"
            "**Chi sono?**\n\n"
            "Mi chiamo PagLO e sono il chatbot privato della azienda italiana PagoPA.\n\n"
            "**Cosa faccio?**\n\n"
            "Il mio compito è quello di fornire assistenza in maniera completa, gentile, e professionale.\n"
            "Rispondo alle domande cercando le risposte su tutta la documentazione scritta sul sito del \"PagoPA DevPortal\": https://developer.pagopa.it/.\n\n"
            "**Le mie regole**\n\n"
            "Ho poche e semplici regole:\n"
            "1. Accetto solo domande in italiano;\n"
            "2. Scrivo le mie risposte solo in italiano;\n"
            "3. Quando possibile, fornisco il link della pagina dove ho trovato la risposta alla domanda fatta;\n"
            "4. Non rispondo ad alcuna domanda che è fuori dal contesto di \"PagoPA DevPortal\";\n"
            "5. Non accetto alcuna domanda e non fornisco alcuna risposta che fornisce informazioni che possono essere utilizzate per distinguere o rintracciare l'identità di un individuo."
        ),
        metadata={
            "source": "",
            "title": "Identità Chatbot",
            "language": "it"
        }
    )]
    for file in tqdm.tqdm(html_files, total=len(html_files)):

        soup = BeautifulSoup(open(file), "html.parser")
        soup_text = soup.find(attrs={"id": "page-content"})
        if soup_text:
            text = soup_text.get_text("/")
        else:
            text = ""
        
        link = file.replace(
            documentation_dir, 
            "https://developer.pagopa.it/"
        ).replace(
            ".html", 
            ""
        )

        if soup.title and soup.title.string:
            title = str(soup.title.string)
        else:
            title = f"PagoPA DevPortal | {os.path.basename(link)}"

        documents.append(Document(
            text=text,
            metadata={
                "source": link,
                "title": title,
                "language": "it"
            }
        ))

    return documents


def build_automerging_index(
        llm,
        embed_model,
        documentation_dir="./PagoPADevPortal/out/",
        save_dir="automerging_index",
        chunk_sizes=[2816, 704, 176],
        chunk_overlap=20
    ):
    
    node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=chunk_sizes, 
        chunk_overlap=chunk_overlap
    )
    
    merging_context = ServiceContext.from_defaults(
        llm=llm,
        embed_model=embed_model,
        node_parser=node_parser
    )

    if not os.path.exists(save_dir):
        logging.info("Creating index...")
    else:
        logging.info("Updating index...")

    assert documentation_dir is not None

    documents = create_documentation(documentation_dir)
    # document = Document(text=full_text)
    
    nodes = node_parser.get_nodes_from_documents(documents)
    leaf_nodes = get_leaf_nodes(nodes)

    storage_context = StorageContext.from_defaults()
    storage_context.docstore.add_documents(nodes)

    automerging_index = VectorStoreIndex(
        leaf_nodes, 
        storage_context=storage_context, 
        service_context=merging_context
    )
    automerging_index.storage_context.persist(
        persist_dir=save_dir
    )
    logging.info(f"Created index successfully and stored in {save_dir}!")

    return automerging_index


def load_automerging_index(
        llm,
        embed_model,
        save_dir="automerging_index",
        chunk_sizes=[2048, 512, 128],
        chunk_overlap=20,
    ):
    
    node_parser = HierarchicalNodeParser.from_defaults(
        chunk_sizes=chunk_sizes, 
        chunk_overlap=chunk_overlap
    )
    
    merging_context = ServiceContext.from_defaults(
        llm=llm,
        embed_model=embed_model,
        node_parser=node_parser
    )

    logging.info(f"{save_dir} exists! Loading index...")
    automerging_index = load_index_from_storage(
        StorageContext.from_defaults(
            persist_dir=save_dir
        ),
        service_context=merging_context,
    )
    logging.info(f"Loaded index from {save_dir} successfully!")

    return automerging_index
