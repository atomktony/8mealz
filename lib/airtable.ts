import "server-only"

const AIRTABLE_BASE_ID = "appUnL0KvDclW8wvW"
const PILOT_TABLE_ID = "tbl53plDve4BVTClj"

type PilotSignupFields = {
  name: string
  email: string
  phone: string
  city: string
}

export async function createPilotSignupRecord(data: PilotSignupFields): Promise<void> {
  const token = process.env.AIRTABLE_PERSONNAL_ACCESS_TOKEN
  if (!token) throw new Error("AIRTABLE_PERSONNAL_ACCESS_TOKEN is not set")

  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${PILOT_TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Name: data.name,
            Email: data.email,
            "Whatsapp Number": data.phone,
            "Where does your family live?": data.city,
          },
        },
      ],
      typecast: true,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Airtable request failed (${res.status}): ${body}`)
  }
}
