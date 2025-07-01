import { Container, Typography, Box, List, ListItem } from "@mui/material";

export default function Terms() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Box>
        <Typography
          variant="h3"
          sx={{ fontWeight: 700, mb: 2, textAlign: "center" }}
        >
          Terms of Use
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ mb: 3, textAlign: "center", color: "#888" }}
        >
          Last updated: July 2024
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Welcome to SorboNexus. By accessing and using this site, you agree to
          comply with these Terms of Use. If you do not agree, please do not use
          the site.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          1. Nature of the Site
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          SorboNexus is an independent, non-official platform for Sorbonne
          Sciences Jussieu alumni and students. It is not affiliated with or
          endorsed by Sorbonne Université.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          2. User Accounts
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You are responsible for maintaining the confidentiality of your
          account and password. You agree to provide accurate information and
          update it as needed.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          3. User Conduct
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You agree to use the site respectfully and lawfully. Prohibited
          actions include:
        </Typography>
        <List sx={{ mb: 2 }}>
          <ListItem>
            Harassment, spam, or posting illegal or offensive content
          </ListItem>
          <ListItem>Impersonation of others</ListItem>
          <ListItem>
            Sharing content you do not have the rights to share
          </ListItem>
        </List>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          4. Content Ownership
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You retain rights to your own content but grant SorboNexus a license
          to display it on the site. You are responsible for the content you
          post.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          5. User-Generated Content
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You are solely responsible for the content you post. The Site does not
          endorse or guarantee the accuracy of user content. The creator
          reserves the right to remove any content at their discretion,
          especially if it violates these Terms or applicable law.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          6. Moderation and Removal
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The site administrators reserve the right to remove any content or
          account that violates these terms or is deemed inappropriate.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          7. Privacy
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          SorboNexus does not use cookies for tracking or advertising.
          Authentication tokens are stored in localStorage for session
          management. For more information, see our Privacy Policy.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          8. Disclaimer of Warranties
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The Site and all content are provided "as is" and "as available"
          without any warranty of any kind, either express or implied. We do not
          guarantee that the Site will be error-free, secure, or uninterrupted.
          To the fullest extent permitted by law, we disclaim all warranties,
          including but not limited to warranties of merchantability, fitness
          for a particular purpose, and non-infringement.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          9. Limitation of Liability
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          To the maximum extent permitted by applicable law, in no event shall
          the creator, contributors, or affiliates be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss
          of profits or revenues, whether incurred directly or indirectly, or
          any loss of data, use, goodwill, or other intangible losses, resulting
          from (a) your use or inability to use the Site; (b) any unauthorized
          access to or use of our servers and/or any personal information stored
          therein.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          10. Indemnification
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          You agree to indemnify, defend, and hold harmless the creator,
          contributors, and affiliates from and against any and all claims,
          damages, obligations, losses, liabilities, costs or debt, and expenses
          (including but not limited to attorney's fees) arising from your use
          of the Site, your violation of these Terms, or your violation of any
          rights of another.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          11. Intellectual Property
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Except for user-contributed content, all content, design, and code on
          SorboNexus are the intellectual property of the creator. You may not
          copy, reproduce, or distribute any part of the Site without express
          permission, except as allowed by applicable open-source licenses.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          12. Termination
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The creator reserves the right to suspend or terminate your access to
          the Site at any time, for any reason, without notice.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          13. Jurisdiction and Governing Law
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          These Terms are governed by and construed in accordance with the laws
          of France and the European Union. Any disputes arising from these
          Terms or your use of the Site will be subject to the exclusive
          jurisdiction of the courts of Paris, France.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          14. No Professional Advice
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The information and advice shared on SorboNexus are for informational
          purposes only and do not constitute professional, academic, or legal
          advice.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          15. Changes to the Site and Terms
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          The creator reserves the right to modify, suspend, or discontinue any
          part of the Site at any time without notice. These Terms may be
          updated at any time; continued use of the Site constitutes acceptance
          of the new Terms.
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 600, mt: 3, mb: 1 }}>
          16. Contact
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          For questions or feedback, contact: sethaguila@icloud.com
        </Typography>
      </Box>
    </Container>
  );
}
