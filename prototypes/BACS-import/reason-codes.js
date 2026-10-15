/* ============================================================================
   BACS reason codes
   ============================================================================

   Section 13.4 of `bacs-import-spec.md`, used as-is. The spec says "Use this
   data as-is", so the JSON below is the spec's own block verbatim — including
   its curly apostrophes, its full stops, and the empty `todo` values that mean
   "no What to do disclosure".

   Extracted programmatically from the spec, not retyped.
   ============================================================================ */
window.REASON_CODES =
{
  "arudd": {
    "title": "ARUDD",
    "intro": "ARUDD reports list direct debit collections that failed, each with a reason code. Apply amendments and cancellations within 3 working days to keep collections accurate.",
    "codes": [
      {"code":"0","title":"Refer to payer","description":"The payer’s bank was unable to pay, typically due to insufficient funds.","todo":"Contact the customer and arrange to retry the payment."},
      {"code":"1","title":"Instruction cancelled","description":"You attempted to collect payment against a cancelled DDI.","todo":"Agree another way to pay any outstanding amount."},
      {"code":"2","title":"Payer deceased","description":"Your customer’s DDI has been cancelled.","todo":""},
      {"code":"3","title":"Account transferred","description":"Send a new DDI, using the new bank details returned.","todo":"If no new bank details were returned, get a new DDI from the customer."},
      {"code":"4","title":"Advance notice disputed","description":"Your customer has disputed being notified of this Direct Debit.","todo":"Don’t collect again until the dispute is resolved with the customer."},
      {"code":"5","title":"No account (or wrong account type)","description":"The paying bank did not recognise the account number submitted; no DDI has been set up.","todo":"Check the DDI details and contact the customer."},
      {"code":"6","title":"No instruction","description":"Your customer does not have a DDI set up with your company.","todo":"Check the DDI details and get a new instruction from the customer."},
      {"code":"7","title":"Amount differs","description":"Your customer reports that the amount taken differs from the amount they were notified of.","todo":"Don’t collect again until the dispute is resolved with the customer."},
      {"code":"8","title":"Amount not yet due","description":"Typically the result of submitting a payment before a DDI is fully set up (less than 2 working days).","todo":"Check the DDI is set up and the advance notice date has passed before collecting again."},
      {"code":"9","title":"Presentation overdue","description":"You tried to collect payment more than 3 working days after the date given to your customer.","todo":"Send a new advance notice before collecting again."},
      {"code":"A","title":"Originator differs","description":"Your details do not match the details on the customer’s DDI.","todo":""},
      {"code":"B","title":"Account closed","description":"Your customer has closed their bank account, cancelling your DDI as a result.","todo":"Get a DDI for a new account if the customer wants to keep paying by Direct Debit."}
    ]
  },
  "auddis": {
    "title": "AUDDIS",
    "intro": "AUDDIS codes relate to setting up and cancelling Direct Debit Instructions (DDIs). They usually arrive 3 working days after a DDI is submitted, but BACS can return one straight away if it finds a problem first.",
    "codes": [
      {"code":"1","title":"Instruction cancelled by payer","description":"Typically received when cancelling a DDI that has already been cancelled.","todo":"Agree another way to pay any outstanding amount."},
      {"code":"2","title":"Payer deceased","description":"Your customer’s DDI has been cancelled.","todo":""},
      {"code":"3","title":"Account transferred to an unknown bank/building society","description":"Resubmit DDI with correct details.","todo":"If no new bank details were returned, get a new DDI from the customer."},
      {"code":"5","title":"No account","description":"The payer account number does not match any bank accounts at the branch for the sort code.","todo":"Check the DDI details and contact the customer."},
      {"code":"6","title":"No instruction","description":"No Direct Debit Instruction matching the details you submitted could be found.","todo":"Check the DDI details and contact the customer."},
      {"code":"7","title":"DDI amount not zero","description":"The amount on all DDI submissions should be nil, indicating an unlimited amount.","todo":"Set the amount to zero and resubmit."},
      {"code":"B","title":"Account closed","description":"Your customer has closed their bank account, cancelling your DDI as a result.","todo":"Get a DDI for a different account."},
      {"code":"C","title":"Account/instruction transferred to a known branch of a bank/building society","description":"Update your DDI only.","todo":"Update the bank details and carry on collecting. Don’t send a 0C/0N pair."},
      {"code":"F","title":"Invalid account type","description":"The customer’s type of bank account is unsuitable for DDIs.","todo":"Get new account details from the customer."},
      {"code":"G","title":"Bank will not accept Direct Debits on account","description":"Direct Debits are disabled for the customer’s bank account.","todo":"Get a DDI for a different account."},
      {"code":"H","title":"Instruction expired","description":"The DDI to cancel has already expired.","todo":"To restart collections, send a new 0N DDI with the customer’s authority."},
      {"code":"I","title":"Payer reference is not unique","description":"The reference on the DDI submitted is already in use for another DDI with this customer.","todo":"Give the DDI a different reference and resubmit it as 0N."},
      {"code":"K","title":"Instruction cancelled by the paying bank","description":"Typically received when cancelling a DDI that has already been cancelled by the paying bank.","todo":"Get a DDI for a new account to keep collecting by Direct Debit."},
      {"code":"L","title":"Incorrect payer’s account details","description":"The customer sort code and account number failed the modulus check to test if these are valid.","todo":"Check the sort code and account number with the customer."},
      {"code":"M","title":"Transaction code/user status incompatible","description":"May apply when converting from a standing order to a DDI.","todo":"Resubmit with transaction code 0N."},
      {"code":"N","title":"Transaction disallowed at payer’s branch","description":"Direct Debits cannot be collected from the sort code specified.","todo":"Get a DDI for a different account."},
      {"code":"O","title":"Invalid reference","description":"Reference does not meet AUDDIS submission rules, for example by using special characters.","todo":"Correct the reference so it meets AUDDIS rules, then resubmit."},
      {"code":"P","title":"Payer’s name not present","description":"The name of the payer is not included in the DDI.","todo":"Add the payer’s name and resubmit."},
      {"code":"Q","title":"Originator’s name blank","description":"The name of your business is not included in the DDI.","todo":"Add the originator’s name and resubmit."}
    ]
  },
  "addacs": {
    "title": "ADDACS",
    "intro": "ADDACS messages report amendments or cancellations to DDIs made by your customers. Deal with them as early as possible.",
    "codes": [
      {"code":"0","title":"Instruction cancelled – refer to payer","description":"This is a general message for cancelled instructions.","todo":"Get a DDI for a new account to keep collecting by Direct Debit."},
      {"code":"1","title":"Instruction cancelled by payer","description":"Your customer has instructed their bank to cancel the DDI.","todo":"Agree another way to pay any outstanding amount."},
      {"code":"2","title":"Payer deceased","description":"Your customer’s DDI has been cancelled.","todo":""},
      {"code":"3","title":"Instruction transferred to another bank/building society","description":"Update your records with the new details provided and send a new DDI.","todo":"If no new bank details were supplied, get a new DDI from the customer."},
      {"code":"B","title":"Account closed","description":"Your customer has closed their bank account, cancelling your DDI as a result.","todo":"Get a DDI for a different account."},
      {"code":"C","title":"Account/instruction transferred to a different branch of a bank/building society","description":"Update DDI details only.","todo":"Update the bank details and carry on collecting. Don’t send a 0C/0N pair."},
      {"code":"D","title":"Advance notice disputed","description":"Your customer is disputing the details of the advance notice with their bank.","todo":"Don’t collect again until the dispute is resolved with the customer."},
      {"code":"E","title":"Instruction amended","description":"Your customer has changed their name or other details on their DDI; update your records only.","todo":"Collect using the updated details. Don’t send a 0C/0N pair."},
      {"code":"R","title":"Instruction re-instated","description":"The paying bank has re-instated a cancelled DDI within 2 months of its cancellation.","todo":"[Confirm: resume collections under the reinstated DDI, or get a new DDI?]"}
    ]
  },
  "txn": {
    "title": "BACS transaction codes",
    "intro": "Codes used in BACS files to identify the type of each transaction.",
    "groups": [
      {"heading":"Value items","codes":[
        {"code":"01","title":"Direct Debit first collection","description":"Processes the first collection on a new DDI."},
        {"code":"17","title":"Direct Debit regular collection, or credit contra (debit record to balance credit records)","description":"This is a standard payment on an existing DDI."},
        {"code":"18","title":"Direct Debit re-presentation","description":"Re-attempt to take payment where a previous payment could not be processed by BACS."},
        {"code":"19","title":"Direct Debit final collection","description":"Processes the last collection on an existing DDI and cancels this DDI immediately after."},
        {"code":"99","title":"Direct Credit, or debit contra","description":"Credit record to balance debit records."}
      ]},
      {"heading":"Direct Debit Instructions (DDIs)","codes":[
        {"code":"0N","title":"New instruction","description":"Creates a new customer DDI or re-instates a cancelled DDI."},
        {"code":"0C","title":"Cancellation instruction","description":"Cancels an existing AUDDIS DDI."},
        {"code":"0S","title":"Conversion instruction","description":"Converts an existing manual DDI to an AUDDIS DDI."}
      ]}
    ]
  }
};
