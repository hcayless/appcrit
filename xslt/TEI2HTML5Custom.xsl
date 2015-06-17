<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"
  exclude-result-prefixes="xs"
  version="1.0">
  <xsl:output indent="no" omit-xml-declaration="yes" method="html"/>
  
  <xsl:template match="/">
    <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html&gt;</xsl:text>
    <html>
      <head>
        <link rel="stylesheet" href="css/tei-html.css"/>
        <link rel="stylesheet" href="js/jquery-ui-1.11.4.custom/jquery-ui.css"/>
        <script type="text/javascript" src="js/elements.js"></script>
        <script type="text/javascript" src="js/jquery/jquery-1.11.3.js"></script>
        <script type="text/javascript" src="js/jquery-ui-1.11.4.custom/jquery-ui.js"></script>
        <script type="text/javascript" src="js/appcrit.js"></script>
      </head>
      <body>
        <xsl:apply-templates/>
      </body>
    </html>
  </xsl:template>
  
  <xsl:template match="*" xml:space="preserve"><xsl:element name="tei-{local-name(.)}"><xsl:apply-templates select="@*"/><xsl:apply-templates select="node()"/></xsl:element></xsl:template>
  
  <xsl:template match="@xml:id">
    <xsl:attribute name="id"><xsl:value-of select="."/></xsl:attribute>
  </xsl:template>
  
  <xsl:template match="@xml:lang">
    <xsl:attribute name="lang"><xsl:value-of select="."/></xsl:attribute>
  </xsl:template>
  
  <xsl:template match="@xml:space">
    <xsl:attribute name="xml-space"><xsl:value-of select="."/></xsl:attribute>
  </xsl:template>
  
  <xsl:template match="@*">
    <xsl:copy-of select="."></xsl:copy-of>
  </xsl:template>
  
</xsl:stylesheet>