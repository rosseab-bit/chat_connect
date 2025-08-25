import Head from "next/head";
import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import { americaCountries } from "@/utils/data";
import SendIcon from "@mui/icons-material/Send";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import { addContact, getContacts, deleteContact, Contact } from "@/utils/db";
import { Orbitron, Rajdhani } from "next/font/google";
import { Alert, Button, Stack } from "@mui/material";

const orbitron = Orbitron({ subsets: ["latin"], weight: ["400", "700"] });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["400", "600"] });

export default function Home() {
  const [numberPhone, setNumberPhone] = useState<string>("");
  const [prefijo, setPrefijo] = useState<string>("");
  const [numberComplete, setNumberComplete] = useState<string>("");
  const [nameContact, setNameContact] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [mensaje, setMensaje] = useState<string>('')
  const [error, setError] = useState<boolean>(false);


  const handleChangePrefijo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(americaCountries[Number(e.target.value)].prefijo);
    setPrefijo(americaCountries[Number(e.target.value)].prefijo);
  };
  const handleChangePhoneNumber = (e: string) => {
    if (prefijo === ""){
      setError(true)
      return
    };
    const onlyNumber = e.replace(/\D/g, "");
    console.log({onlyNumber})
    setNumberPhone(onlyNumber);
  };
  const handleChangeNameContact = (e: string) => {
    if (prefijo === "") return;
    setNameContact(e);
  };
  const handleMensaje = (e:string) =>{
    if (prefijo === ""){
      setError(true)
      return
    };
    setMensaje(e)
  }
  const loadContact = (item: Contact) => {
    setNumberPhone(item.numberPhone);
  };
  useEffect(() => {
    const concatPrefijoNumber: string = prefijo + numberPhone;
    setNumberComplete(concatPrefijoNumber);
  }, [numberPhone, prefijo]);

  useEffect(() => {
    getContacts().then(setContacts);
  }, []);

  const handleAddContact = async () => {
    if (!nameContact || !numberPhone) return;

    await addContact({ nameContact, numberPhone });
    setContacts(await getContacts());

    setNameContact("");
    setNumberComplete("");
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await deleteContact(id);
    setContacts(await getContacts());
  };

  const redirectUrls = () => {
    let url: string = `https://wa.me/${numberComplete}?text=${encodeURIComponent(mensaje)}`;
    //console.log({url})
    window.open(url, "_blank", "noopener,noreferrer");
    return null;
  };
  return (
    <>
      <Head>
        <title>Chat Connect</title>
        <meta name="Chat Connect" content="Redirect chat to Whatsapp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
         <link rel="manifest" href="/manifest.json" />
         <meta name="theme-color" content="#000" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main_body}`}>
        {error && 
        <Stack spacing={2} sx={{ width: "100%" }}>
        <Alert
          variant="filled"
          severity="error"
          onClose={() => setError(false)} // permite cerrar el alert
        >
          "Es necesario ingresar un prefijo..."
        </Alert>
        </Stack>
        }
        <h1 >Go WhatsApp 💬</h1>
        <section className={`${styles.section_form}`}>
          <label className={`${styles.sub_title}`}>Phone Number 🔢📱</label>
          <div className={styles.form_body}>
            <select className={styles.select_options_main} onChange={handleChangePrefijo}>
              <option>SELECT</option>
              {americaCountries.map(
                (item: Record<string, string>, index: number) => (
                  <option value={index} className={`${styles.option_select}`}>
                    {item.prefijo} {item.flag}
                  </option>
                )
              )}
            </select>
            <input
              value={numberPhone}
              onChange={(e) => handleChangePhoneNumber(e.target.value)}
              type="number"
              placeholder="phone number"
              className={`${styles.input_number}`}
            />
          </div>
          <textarea value={mensaje} className={`${styles.body_message}`} onChange={(e) => handleMensaje(e.target.value)}></textarea>
          <button
            className={`${styles.button_send}`}
            onClick={() => redirectUrls()}
          >
            Send message <SendIcon className={`${styles.icon_send}`} />
          </button>
        </section>
        <div className={styles.horizontal_line}></div>
        <section className={`${styles.form_save_number}`}>
          <form className={`${styles.form_input_save}`}>
            <input
              className={`${styles.input_save}`}
              value={nameContact}
              onChange={(e) => handleChangeNameContact(e.target.value)}
              type="text"
              placeholder="Name"
            />
            <input
              value={numberComplete}
              className={`${styles.input_save}`}
              placeholder="Phone Number"
              disabled
            />
          </form>
        </section>
        <button
          className={`${styles.button_save}`}
          onClick={() => handleAddContact()}
        >
          Save <ContactPhoneIcon className={`${styles.icon_save}`} />{" "}
        </button>
        <div className={styles.horizontal_line}></div>
        <section className={`${styles.contacts_saved}`}>
          {contacts.map((item: Contact, index: number) => (
            <div
              className={`${styles.card_contact}`}
              onClick={() => loadContact(item)}
            >
              <div className={`${styles.name_contact}`}>
                <span>{item.nameContact}</span>{" "}
                <SendIcon className={`${styles.name_contact_delete}`} />
              </div>
              <button
                className={`${styles.name_contact_delete}`}
                onClick={() => handleDelete(item.id)}
              >
                🗑️
              </button>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
