#Demographics

###Object Schema:

```
var demographics = {
  "name": {cda_name},
  "dob": {
    "date":{type: datetime, required: true},
    "precision":{type:string, required: true}
  },
  "gender": {type:string, required: true},
  "identifiers": [
    "identifier": {type:string, required: true},
    "identifier_type": {type:string, required: true}
  ],
  "marital_status": {type: string, required: false},
  "address": [{cda_address}],
  "phone": [{
    "number": {type: string, required: true},
    "type": {type: string, required: true}
  }],
  "email": [{
    "address": {type: string, required: true},
    "type": {type:string, required: true}
  }],
  "race_ethnicity": {type:string, required: false},
  "religion": {type:string, required: false},
  "languages": [
    "language": {type: string, required: true},
    "proficiency": {type: string, required: false},
    "mode": {type: string, required: false}
  ],
  "birthplace": {
    "state": {type: string, required: false},
    "postal_code": {type: string, required: false},
    "country": {type: string, required: false}
  },
  "guardian": {
    "name": {cda_name},
    "relationship": {type: string, required: false},
    "address": [{cda_address}],
    "phone": [{
       "number": {type: string, required: true},
       "type": {type: string, required: true}
     }],
     "email": [{
       "address": {type: string, required: true},
       "type": {type:string, required: true}
     }],
  },
  "provider": {
    "organization": {type: string, required: true},
    "national_provider_identifier": {type: string, required: false},
    "phone": [{
      "number": {type: string, required: true},
      "type": {type: string, required: true}
    }],
    "email": [{
      "address": {type: string, required: true},
      "type": {type:string, required: true}
    }],
    "address": [{cda_address}]
}

var cda_address = {
    "type": {type: string, required: true},
    "primary": {type: boolean, required: true},
    "street": [{type: string, required: true}],
    "city": {type: string, required: true},
    "state": {type: string, required: false},
    "postal_code": {type: string, required: false},
    "country": {type: string, required: false}
 }

var cda_name = {
    "prefix": [{type: string, required: false}],
    "first": {type: string, required: true},
    "middle": [{type: string, required: false],
    "last": {type: string, required: true},
    "suffix": {type: string, required: false}
  }
```


####General Notes
* Assumption:  Each record can have more than one recordTarget.  This seems inaccurate, as it would result in duplicative patient information, so it is ignored.

#####Changes
* Added identifier.
* Refactored address to have indicators.
* Extended name object.
* Added DOB precision.
* Redefined "zip" to "postal_code", now a string.
* Changed phones to be array, no rule against multiple home or work numbers.
* Added "other" to phone, to support "vacation phone."
* Changed email to an array.
* Language 'en-US' implied record language, not spoken language.  Removed.
* Merged race and ethnicity fields (see notes below).
* Rewired guardian to use common objects.
* Added NPI, changed provider to use common objects.

####name
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/name
* OID: 2.16.840.1.113883.10.20.22.5
* Not supported:  Optional "@use" element.

####name.prefix
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/name/prefix
* Not supported:  Optional "@qualifier" element. 

####name.first
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/name/given[0]
* Not supported:  Optional "@qualifier" element. 
* Specification dictates at least one given name required, can be parsed as first.

####name.middle
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/name/given[1-n]
* Specification dictates that any second given name is middle.
* Assumption: any other given names are middle names.
* Not supported:  Optional "@qualifier" element.
* May be valuable to concatenate multiple middle-names to single object.

####name.last
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/name/family
* Not supported:  Optional "@qualifier" element.

####name.suffix
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/name/suffix
* Not supported:  Optional "@qualifier" element.

####dob
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/birthTime@value
* This must be precise to at least year.

####gender
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/administrativeGenderCode@code
* must equal either 'M', 'F', or 'UN'.

####identifiers
* 0..*
* //ClinicalDocument/recordTarget/patientRole/id
* Technically, this is required.  However, nullFlavor is acceptable.  If nullFlavor is found, the identifier should be rejected.

####identifiers.identifier_root
* 1..1
* //ClinicalDocument/recordTarget/patientRole/id@root
* This can either be an OID, UUID, or UID.
* Can later be enhanced to lookup a subset of the HL7 OID registry and store text name.

####identifiers.identifier
* 1..1
* //ClinicalDocument/recordTarget/patientRole/id@extension
* This is the actual identifier.

####marital_status
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/maritalStatusCode@code
* Code should be translated to text against HL7 Marital Status 2.16.840.1.113883.1.11.12212 DYNAMIC.

####address

* 1..*
* //ClinicalDocument/recordTarget/patientRole/addr
* Addresses must conform to US Realm Address (AD.US.FIELDED).

####address.type
* 1..1
* //ClinicalDocument/recordTarget/patientRole/addr@use
* This is derivative of PostalAddressUse 2.16.840.1.113883.1.11.10637 STATIC.
* If this field is in ('HP'(primary home), 'H'(home address), or 'HV'(vacation home), should be 'home'.
* If this field is 'WP'(work place), should be 'work'.
* If not home or work, should be 'other'.

####address.primary
* 1..1
* //ClinicalDocument/recordTarget/patientRole/addr@use
* If this field is 'HP'(primary home), this should be set to true.  Otherwise, it should be false.

####address.street
* 1..4
* //ClinicalDocument/recordTarget/patientRole/street[0-3]
* Note: Should be stored sequentially, array order important.

####address.city
* 1..1
* //ClinicalDocument/recordTarget/patientRole/city

####address.state
* 0..1
* //ClinicalDocument/recordTarget/patientRole/state
* State is required for all US-based addresses only.

####address.postal_code
* 0..1
* //ClinicalDocument/recordTarget/patientRole/postalCode
* Postal Code is required for all US-based addresses only.

####address.country
* 0..1
* //ClinicalDocument/recordTarget/patientRole/country
* If no country is present, it is assumed to be US.

####phone
* 1..*
* //ClinicalDocument/recordTarget/patientRole/phone
* Each record must have at least one phone or email entry.
* Each phone record should be checked for 'tel:' lead of value.

####phone.number
* 0..*
* //ClinicalDocument/recordTarget/patientRole/telecom@value
* Should be checked for 'tel:' lead, and parsed as phone if valid.

####phone.type
* 0..*
* //ClinicalDocument/recordTarget/patientRole/telecom@use
* Should be checked for 'tel:' lead, and parsed as phone if valid.
* Depending on what is in the "@use", this should be "home", "work", "mobile", or "other".
* Other is for "HV", or when @use isn't supplied.

####email
* 0..*
* //ClinicalDocument/recordTarget/patientRole/telecom
* Each phone record should be checked for 'mailto:' lead of value.

####email.address
* 0..*
* //ClinicalDocument/recordTarget/patientRole/telecom@value
* Should be checked for 'mailto:' lead, and parsed as phone if valid.

####email.type
* 0..*
* //ClinicalDocument/recordTarget/patientRole/telecom@use
* Should be checked for 'mailto:' lead, and parsed as phone if valid.
* Depending on what is in the "@use", this should be "home", "work", or "other".
* Other is for "HV", "MC", or when @use isn't supplied.  Mobile email isn't a thing.

####race_ethnicity
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/raceCode@code
* //ClinicalDocument/recordTarget/patientRole/patient/ethnicGroupCode@code
* Ethnicity only exists because race's source set doesn't account for hispanics.
* If ethnicity is "2186-5", take race field.  Otherwise, take this field.
* Should be looked up against a code set.

####religion
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/religiousAffiliationCode@code
* Should be looked up against a code set.

####birthplace
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/birthPlace/place
* Is a subset of a standard address components, including possibly postalCode, state, and country.

####guardian
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/guardian

####guardian.relationship
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/code@code
* Should be looked up against reference table OID 2.16.840.1.113883.1.11.19563 DYNAMIC.

####guardian.address
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/address
* Uses the same model and requirements as the patient address.

####guardian.phone
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/telecom
* Each phone record should be checked for 'tel:' lead of value.

####guardian.phone.number
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/telecom@value
* Should be checked for 'tel:' lead, and parsed as phone if valid.

####guardian.phone.type
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/telecom@use
* Should be checked for 'tel:' lead, and parsed as phone if valid.
* Depending on what is in the "@use", this should be "home", "work", "mobile", or "other".
* Other is for "HV", or when @use isn't supplied.

####guardian.email
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/telecom
* Each phone record should be checked for 'mailto:' lead of value.

####guardian.email.address
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/telecom@value
* Should be checked for 'mailto:' lead, and parsed as phone if valid.

####guardian.email.type
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/telecom@use
* Should be checked for 'mailto:' lead, and parsed as phone if valid.
* Depending on what is in the "@use", this should be "home", "work", or "other".
* Other is for "HV", "MC", or when @use isn't supplied.  Mobile email isn't a thing.

####guardian.name
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/name
* OID: 2.16.840.1.113883.10.20.22.5
* Not supported:  Optional "@use" element.

####guardian.name.prefix
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/name/prefix
* Not supported:  Optional "@qualifier" element. 

####guardian.name.first
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/name/given[0]
* Not supported:  Optional "@qualifier" element. 
* Specification dictates at least one given name required, can be parsed as first.

####guardian.name.middle
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/name/given[1-n]
* Specification dictates that any second given name is middle.
* Assumption: any other given names are middle names.
* Not supported:  Optional "@qualifier" element.
* May be valuable to concatenate multiple middle-names to single object.

####guardian.name.last
* 1..1
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/name/family
* Not supported:  Optional "@qualifier" element.

####guardian.name.suffix
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/guardian/name/suffix
* Not supported:  Optional "@qualifier" element.

####provider
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/providerOrganization

####provider.name
* 0..1
* //ClinicalDocument/recordTarget/patientRole/patient/providerOrganization/name
* This can have prefix, and suffix, as well as validTime.
* Prefix and suffix if present should be appended.
* Not Supported:  validTime.
* Not Supported: Name part qualifiers.

####provider.national_provider_identifier
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/providerOrganization/id@value
* Must make sure OID @root="2.16.840.1.113883.4.6" (NPI OID).

####provider.phone
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/providerOrganization/telecom
* Each phone record should be checked for 'tel:' lead of value.
* Each entry will contain at least either one phone or email.

####provider.phone.number
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/providerOrganization/telecom@value
* Should be checked for 'tel:' lead, and parsed as phone if valid.

####provider.phone.type
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/providerOrganization/telecom@use
* Should be checked for 'tel:' lead, and parsed as phone if valid.
* Depending on what is in the "@use", this should be "home", "work", "mobile", or "other".
* Other is for "HV", or when @use isn't supplied.

####provider.email
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/providerOrganization/telecom
* Each phone record should be checked for 'mailto:' lead of value.

####provider.email.address
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/providerOrganization/telecom@value
* Should be checked for 'mailto:' lead, and parsed as phone if valid.

####provider.email.type
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/providerOrganization/telecom@use
* Should be checked for 'mailto:' lead, and parsed as phone if valid.
* Depending on what is in the "@use", this should be "home", "work", or "other".
* Other is for "HV", "MC", or when @use isn't supplied.  Mobile email isn't a thing.

####provider.address
* 0..*
* //ClinicalDocument/recordTarget/patientRole/patient/providerOrganization/address
* Uses the same model and requirements as the patient address.