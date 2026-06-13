public with sharing class DreamHouseSampleDataController {
  @RemoteAction
  public static void deleteAll() {
    try {
      delete [SELECT ID FROM property__c];
      delete [SELECT ID FROM broker__c];
    } catch (DmlException e) {
      throw new AuraHandledException(
        'Failed to delete sample data: ' + e.getMessage()
      );
    }
  }
}
