import React from "react";
import { useDocuments } from "@sanity/sdk-react";
import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
} from "@sanity/ui";

export function PageTable() {
  // Load all page documents
  const { data: documents, isPending } = useDocuments({
    documentType: "page",
    batchSize: 50,
    orderings: [{ field: "_createdAt", direction: "desc" }],
  });

  if (isPending) {
    return (
      <Container width={1}>
        <Card padding={5} shadow={1} radius={3} marginY={5}>
          <Flex align="center" justify="center" paddingY={7}>
            <Spinner muted />
          </Flex>
        </Card>
      </Container>
    );
  }

  return (
    <Container width={1}>
      <Card padding={5} shadow={1} radius={3} marginY={5}>
        <Stack space={4}>
          <Flex align="center" gap={3}>
            <Text>📄</Text>
            <Heading size={4}>Page Documents</Heading>
            <Badge tone="primary" mode="outline">
              {documents?.length || 0} pages
            </Badge>
          </Flex>

          {documents && documents.length > 0 ? (
            <Grid columns={1} gap={3}>
              {documents.map((docHandle) => (
                <PageTableRow
                  key={docHandle.documentId}
                  docHandle={docHandle}
                />
              ))}
            </Grid>
          ) : (
            <Card padding={4} tone="primary" radius={2}>
              <Stack space={2}>
                <Text size={2} weight="medium">
                  No pages found
                </Text>
                <Text size={1} muted>
                  There are no page documents in your dataset yet.
                </Text>
              </Stack>
            </Card>
          )}
        </Stack>
      </Card>
    </Container>
  );
}

interface PageTableRowProps {
  docHandle: any;
}

function PageTableRow({ docHandle }: PageTableRowProps) {
  // Load the actual document data
  const { data: documents } = useDocuments({
    documentType: "page",
    batchSize: 1,
    filter: `_id == "${docHandle.documentId}"`,
  });

  const pageData = documents?.[0];

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  if (!pageData) {
    return (
      <Card padding={4} tone="transparent">
        <Flex align="center" justify="center" paddingY={3}>
          <Spinner size={1} muted />
        </Flex>
      </Card>
    );
  }

  return (
    <Card padding={4} radius={2} shadow={1}>
      <Grid columns={[1, 1, 4]} gap={4} style={{ alignItems: "center" }}>
        {/* Title Column */}
        <Box>
          <Stack space={1}>
            <Text size={2} weight="medium">
              {pageData.title || "Untitled Page"}
            </Text>
            {pageData.description && (
              <Text size={1} muted>
                {pageData.description.length > 80
                  ? `${pageData.description.substring(0, 80)}...`
                  : pageData.description}
              </Text>
            )}
          </Stack>
        </Box>

        {/* Slug Column */}
        <Box>
          <Stack space={1}>
            <Text size={1} weight="medium" muted>
              URL
            </Text>
            <Text size={1} muted>
              {pageData.slug?.current || "No slug"}
            </Text>
          </Stack>
        </Box>

        {/* Date Column */}
        <Box>
          <Stack space={1}>
            <Text size={1} weight="medium" muted>
              Created
            </Text>
            <Text size={1} muted>
              {formatDate(pageData._createdAt)}
            </Text>
          </Stack>
        </Box>

        {/* Actions Column */}
        <Box>
          <Flex gap={2} justify="flex-end">
            <Button
              text="Edit"
              mode="ghost"
              tone="primary"
              onClick={() => {
                console.log("Edit clicked for:", pageData.title);
                // TODO: Add editing functionality
              }}
            />
          </Flex>
        </Box>
      </Grid>
    </Card>
  );
}
